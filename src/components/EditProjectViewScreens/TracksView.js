import React, { useState, useEffect } from 'react';
import Helpers from '../../Helpers';
import TrackFile from '../../models/TrackFile';

const TracksView = ({ project, currentTrack, setCurrentTrack }) => {
    const [uploadingTracks, setUploadingTracks] = useState({});
    const [tracks, setTracks] = useState([]);
    const [dragging, setDragging] = useState(false); // to track if a drag is active

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const tracksFromProject = await project.getSnapshotOfTracks();
                setTracks(tracksFromProject);
            } catch (error) {
                console.error("Error fetching tracks:", error);
            }
        };

        fetchTracks();
    }, [project]);

    const handleTrackClick = track => {
        setCurrentTrack(track);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        if (!dragging) {
            setDragging(true);
        }
    };
    
    const isChildElement = (parent, child) => {
        let node = child;
        while (node) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    
    const handleDragLeave = (event) => {
        // Check if the mouse is still within the parent container (tracks-list)
        if (!isChildElement(event.currentTarget, event.relatedTarget)) {
            setDragging(false);
        }
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        setDragging(false);
        
        const files = event.dataTransfer.files;
    
        if (files.length > 0) {
            const file = files[0];
    
            if (file.type.startsWith("audio/")) {
                const trackFile = new TrackFile(file, project.id, project.artist.id);
                const newTrack = await trackFile.asTrack();
                const updatedTracks = [...tracks, newTrack];
                setTracks(updatedTracks);

                // Update the uploading progresses in the dictionary
                const progressCallback = (id, progress) => {
                    setUploadingTracks(prevUploadingTracks => {
                        if (progress === 200 || progress === 500) {
                            const updatedTracks = { ...prevUploadingTracks };
                            delete updatedTracks[id];
                            return updatedTracks;
                        } else {
                            return {
                                ...prevUploadingTracks,
                                [id]: progress
                            };
                        }
                    });
                };                

                trackFile.upload(progressCallback);
            } else {
                console.error("Only audio files are supported.");
                // Optionally, provide feedback to the user
            }
        }
    };

    return (
        <div 
            className={`tracks-list ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {dragging && <div className="dropzone-prompt">Drop files here to upload</div>}
            {tracks.map((track, index) => (
                <div 
                    key={track.id} 
                    className="track-item"
                    onClick={() => handleTrackClick(track)} 
                >
                    <div className="track-number">{index + 1}.</div>
                    <div className="track-info">
                        <div className={`track-name ${track.id === currentTrack?.id ? 'selected' : ''}`}>
                            {track.name}
                        </div>
                        <div className="track-duration">
                            {uploadingTracks[track.id] != null 
                            ? `Uploading (${uploadingTracks[track.id]}%)` 
                            : Helpers.formatDuration(track.duration)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TracksView;