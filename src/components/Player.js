import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faBackward, faForward } from '@fortawesome/free-solid-svg-icons'
import placeholder from '../gradient-placeholder.png';
import Helpers from '../Helpers';

const Player = forwardRef((props, ref) => {

    const { tracks, currentTrack, setCurrentTrack } = props;
    
    const audioRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [audioElements, setAudioElements] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);

    useImperativeHandle(ref, () => ({
        playProject: () => {
            // Your play logic here
            if (tracks) {
                if (tracks[0] === currentTrack) {
                    resetAndPlayCurrentTrack();
                } else {
                    setCurrentTrack(tracks[0]);
                }
            }
        },
    }));

    useEffect(() => {
        // Create audio elements and preload
        const audioEls = tracks
            .filter(track => track && track.audioUrl)  // Filter out tracks without audioUrl
            .map(track => {
            const audio = new Audio(track.audioUrl);
            audio.preload = 'auto';  // This allows browser to decide, usually it will preload.
            return audio;
        });
    
        setAudioElements(audioEls); 
    }, [tracks]);

    useEffect(() => {
        if (currentTrack) {

            if(currentTrack.isLocked) {
                playNextTrack();
            }

            const currentIdx = tracks.findIndex(track => track.id === currentTrack.id);

            if (audioRef.current) {
                // Reset the current audio ref
                audioRef.current.currentTime = 0;
                audioRef.current.pause();
            }

            if (audioElements[currentIdx]) {
                audioRef.current = audioElements[currentIdx];  // Point the ref to the preloaded audio
                setProgress(0);
                setIsPlaying(true);
                audioRef.current.play().catch(error => {
                    console.error('Playback error:', error);
                });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack]);

    useEffect(() => {
        setElapsedTime(audioRef.current.currentTime);
    }, [progress])

    useEffect(() => {
        const currentAudio = audioRef.current;

        const handleTimeUpdate = () => {
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            setProgress(progress);
        };

        const handleTrackEnd = () => {
            playNextTrack();
        };
    
        if (currentAudio) {
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
    
    function resetAndPlayCurrentTrack() {
        setProgress(0);
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }

    function playPreviousTrack() {
        const currentIdx = tracks.findIndex(track => track.id === currentTrack.id);
        
        let prevTrackIdx = currentIdx - 1;
        
        // Keep looking for an unlocked track
        while (prevTrackIdx >= 0 && tracks[prevTrackIdx].isLocked) {
            prevTrackIdx--;
        }
        
        if (prevTrackIdx >= 0 && audioRef.current.currentTime <= 3) {
            setCurrentTrack(tracks[prevTrackIdx]);
        } else {
            resetAndPlayCurrentTrack();
        }
    }

    function playNextTrack() {
        const currentIdx = tracks.findIndex(track => track.id === currentTrack.id);  // Derive the current index directly
    
        let nextTrackIdx = currentIdx + 1;
    
        // Keep looking for an unlocked track
        while (nextTrackIdx < tracks.length && tracks[nextTrackIdx].isLocked) {
            nextTrackIdx++;
        }
    
        // If we found an unlocked track
        if (nextTrackIdx < tracks.length) {
            const newTrack = tracks[nextTrackIdx];
            setCurrentTrack(newTrack);
        }
    }

    const togglePlayPause = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const skipBackward = () => {
        playPreviousTrack();
    };

    const skipForward = () => {
        playNextTrack();
    };

    const handleSeek = (event) => {
        const newValue = event.target.value;
        const newTime = (audioRef.current.duration * newValue) / 100;
        audioRef.current.currentTime = newTime;
        setProgress(newValue);
    };

    if (!currentTrack) return null;

    return (
        <div className="player">
            <div className="player-left">
                <img src={currentTrack.project.imageUrl || placeholder} alt="Album Art" className="player-art" />
                <div className="player-info">
                    <span className="track-name">{currentTrack.name}</span>
                    <span className="artist-name">{currentTrack.project.name}</span>
                </div>
            </div>
            <div className="player-center">
                <div className="controls">
                    {/* You can use SVGs or icons for these controls */}
                    <FontAwesomeIcon className="skip-back" onClick={skipBackward} icon={faBackward} />
                    <button className="play-pause" onClick={togglePlayPause}>
                        {isPlaying ? 
                            <FontAwesomeIcon icon={faPause} /> : 
                            <FontAwesomeIcon icon={faPlay} />
                        }
                        </button>
                        <FontAwesomeIcon className="skip-forward" onClick={skipForward} icon={faForward} />
                </div>
                <div className="scrub-bar">
                    <span className="time-label">{Helpers.formatDuration(elapsedTime)}</span>
                    <div className="scrub-bar-controls">                
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                    <input 
                        type="range" 
                        value={progress} 
                        max="100" 
                        className="seeker" 
                        onChange={handleSeek} 
                    />
                    </div>
                    <span className="time-label">{Helpers.formatDuration(currentTrack.duration)}</span>
                </div>
               
                </div>
        </div>
    );
});

export default Player;