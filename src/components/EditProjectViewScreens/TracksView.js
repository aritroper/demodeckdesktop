import React, { useState, useEffect } from 'react';

const TracksView = ({ project, currentTrack, setCurrentTrack }) => {
    const [tracks, setTracks] = useState([]);

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
    }, [project]); // Only use the project as a dependency

    const handleTrackClick = track => {
        setCurrentTrack(track);
    };

    return (
        <div className="tracks-list">
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
                        <div className="track-duration">{track.duration}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TracksView;