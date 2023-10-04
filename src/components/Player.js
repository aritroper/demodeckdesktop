import React, { useEffect, useRef } from 'react';

const Player = ({ currentTrack, currentAlbum }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current && currentTrack) {
            audioRef.current.play();
        }
    }, [currentTrack]);

    const togglePlayPause = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    };

    if (!currentTrack) return null;

    return (
        <div className="player">
            <div className="player-left">
                <img src={currentAlbum.imageUrl} alt="Album Art" className="player-art"/>
                <div className="player-info">
                    <span className="track-name">{currentTrack.name}</span>
                    <span className="artist-name">{currentTrack.artist}</span>
                </div>
            </div>
            <div className="player-center">
                <div className="scrub-bar"> 
                    {/* Scrub bar goes here */}
                </div>
                <div className="controls">
                    {/* You can use SVGs or icons for these controls */}
                    <button className="skip-back">«</button>
                    <button className="play-pause" onClick={togglePlayPause}>Play/Pause</button>
                    <button className="skip-forward">»</button>
                </div>
            </div>
            <audio ref={audioRef} src={currentTrack.audioUrl} />
        </div>
    );
};

export default Player;