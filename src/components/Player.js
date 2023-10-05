import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faBackward, faForward } from '@fortawesome/free-solid-svg-icons'

const Player = ({ project, currentTrack, setCurrentTrack }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        if (project) {
            // Fetching tracks when a new project is selected
            const fetchTracks = async () => {
                const projectTracks = await project.getSnapshotOfTracks();
                setTracks(projectTracks);
            };
            
            fetchTracks();
        }
    }, [project]);

    useEffect(() => {
        if (audioRef.current && currentTrack) {
            setIsPlaying(true);
            audioRef.current.play();
        }
    }, [currentTrack, tracks]);

    useEffect(() => {
        const currentAudio = audioRef.current;
    
        const handleTimeUpdate = () => {
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            setProgress(progress);
        };

        const handleTrackEnd = () => {
            const currentIdx = tracks.findIndex(track => track.id === currentTrack.id);  // Derive the current index directly
            const nextTrackIdx = currentIdx + 1;
            if (nextTrackIdx < tracks.length) {
                const newTrack = tracks[nextTrackIdx];
                setCurrentTrack(newTrack);
            } else {
                setIsPlaying(false);
            }
        };
    
        if (currentAudio) {
            console.log("Attaching event listeners")
            currentAudio.addEventListener('timeupdate', handleTimeUpdate);
            currentAudio.addEventListener('ended', handleTrackEnd);
        }
    
        // Clean up the event listener on component unmount
        return () => {
            if (currentAudio) {
                currentAudio.removeEventListener('timeupdate', handleTimeUpdate);
                currentAudio.removeEventListener('ended', handleTrackEnd);
            }
        };
    }, [currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps

    const togglePlayPause = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    if (!currentTrack) return null;

    return (
        <div className="player">
            <div className="player-left">
                <img src={currentTrack.project.imageUrl} alt="Project Art" className="player-art"/>
                <div className="player-info">
                    <span className="track-name">{currentTrack.name}</span>
                    <span className="artist-name">{currentTrack.project.name}</span>
                </div>
            </div>
            <div className="player-center">
                <div className="controls">
                    {/* You can use SVGs or icons for these controls */}
                    <FontAwesomeIcon className="skip-back" icon={faBackward} />
                    <button className="play-pause" onClick={togglePlayPause}>
                        {isPlaying ? 
                            <FontAwesomeIcon icon={faPause} /> : 
                            <FontAwesomeIcon icon={faPlay} />
                        }
                        </button>
                        <FontAwesomeIcon className="skip-forward" icon={faForward} />
                </div>
                <div className="scrub-bar">
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <audio ref={audioRef} src={currentTrack.audioUrl} />
        </div>
    );
};

export default Player;