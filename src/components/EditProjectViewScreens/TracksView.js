import React, { useState, useEffect } from 'react';

const TracksView = ({ album, onSelectTrack }) => {
    const [tracks, setTracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const tracksFromAlbum = await album.getSnapshotOfTracks();
                setTracks(tracksFromAlbum);
            } catch (error) {
                console.error("Error fetching tracks:", error);
            }
        };

        fetchTracks();
    }, [album]); // Only use the album as a dependency

    const handleTrackClick = track => {
        onSelectTrack(track);
        setSelectedTrack(track.id); // set the clicked track ID to the selectedTrack state
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
                        <div className={`track-name ${track.id === selectedTrack ? 'selected' : ''}`}>
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