import React, { useState, useEffect } from 'react';
import Helpers from '../../Helpers';
import TrackFile from '../../models/TrackFile';

const TracksView = ({ project, tracks, setTracks, currentTrack, setCurrentTrack }) => {
    const [uploadingTracks, setUploadingTracks] = useState({});
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project]);

    const handleTrackClick = track => {
        if (track.isLocked) {
            alert("Unlock this track by upgrading your storage plan from your Demodeck app.");
        } else {
            setCurrentTrack(track);
        }
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
    
        const files = Array.from(event.dataTransfer.files);
        const newTracksList = []; // Temporary array to accumulate new tracks
    
        if (files.length > 0) {
            const audioFiles = files.filter(file => file.type.startsWith("audio/"));
    
            if (audioFiles.length === 0) {
                console.error("No valid audio files found. Only audio files are supported.");
                return;
            }
    
            for (const file of audioFiles) {
                const trackFile = new TrackFile(file, project);
                const newTrack = await trackFile.asTrack();
                newTracksList.push(newTrack);
    
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
            }
    
            // Update the tracks state only once after all new tracks have been added
            setTracks([...tracks, ...newTracksList]);
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
                        <div className={`track-name ${track.id === currentTrack?.id ? 'selected' : ''} ${track.isLocked === true ? 'locked' : ''}`}>
                            {track.name}
                        </div>
                        <div className="track-duration">
                        {
                            track.isLocked 
                            ? "Locked"
                            : uploadingTracks[track.id] != null 
                                ? `Uploading (${uploadingTracks[track.id]}%)` 
                                : Helpers.formatDuration(track.duration)
                        }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TracksView;