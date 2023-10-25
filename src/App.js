import React, { useState, useRef, useEffect } from 'react';
import MenuBar from './components/MenuBar'
import ProjectsList from './components/ProjectList';
import AlbumArt from './components/AlbumArt';
import LinkSharingModal from './components/LinkSharingModal'; 
import EditProjectView from './components/EditProjectView';
import ProjectActivity from './components/ProjectActivity';
import Player from './components/Player';
import Login from './components/Login';
import SelectArtistPopup from './components/SelectArtistPopup';
import icon from './icon.png';
import User from './models/User';
import Artist from './models/Artist';
import firebase from './firebaseConfig';
import SettingsPopup from './components/SettingsPopup';
import Helpers from  './Helpers';
import placeholder from './gradient-placeholder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import Project from './models/Project';

function App() {
    const [isSelectArtistPopupVisible, setIsSelectArtistPopupVisible] = useState(false);
    const [isSettingsPopupVisible, setIsSettingsPopupVisible] = useState(false);
    const [isSharingPopupVisible, setIsSharingPopupVisible] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // (1) useState for window width

    const playerRef = useRef();

    useEffect(() => {
        // Initial fetch of the URL params and project setup
        const setupProjectFromURL = async () => {
            const params = new URLSearchParams(window.location.search);
            const encodedArtistId = params.get('aid');
            const encodedProjectId = params.get('pid');
    
            if (encodedArtistId && encodedProjectId) {
                const artistId = atob(encodedArtistId);
                const projectId = atob(encodedProjectId);
                const project = await Project.getProjectById(artistId, projectId);
                setSelectedProject(project);
            }
        };
    
        // Authentication state change handling
        const handleAuthStateChange = async user => {
            if (user) {
                await handleLoginSuccess(user);
                await setupProjectFromURL();
            } else {
                setLoggedIn(false);
                await setupProjectFromURL();
            }

            setLoading(false);
        };
    
        // Initialize the setup and auth subscription
        const init = async () => {
            // Subscribe to auth state changes
            const unsubscribe = firebase.auth().onAuthStateChanged(handleAuthStateChange);

            // Cleanup
            return () => unsubscribe();
        };
    
        init();
    }, []);

    useEffect(() => {
        // (2) useEffect to handle window resize event
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLoginSuccess = async (user) => {
        const loggedInUser = await User.getUserById(user.uid);
        if (loggedInUser.artistIds.length > 0) {
            const selectedArtist = await Artist.getArtistById(loggedInUser.artistIds[0]);
            setSelectedArtist(selectedArtist);
        }
        setLoggedIn(true);
    };

    const handleArtistSelect = (artist) => {
        setSelectedArtist(artist);
        setIsSelectArtistPopupVisible(false);
    };

    if (loading) {
        return (
            <div className="splash-screen">
                <img src={icon} alt="Demodeck Logo" className="splash-logo" />
            </div>
        );
    }

    if (!loggedIn & !selectedProject) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="app-wrapper">  {/* A new wrapping div */}
            <div className="app-container">
                {isSelectArtistPopupVisible && <SelectArtistPopup 
                    onSelect={handleArtistSelect}
                    onClose={() => setIsSelectArtistPopupVisible(false)}
                    isActive={isSelectArtistPopupVisible}
                />}
                {isSettingsPopupVisible && <SettingsPopup 
                    onClose={() => setIsSettingsPopupVisible(false)}
                />}
                <div className="projects-section">
                    <img src={icon} alt="Demodeck Icon" className="icon" />
                    <MenuBar 
                        onSettings={() => { setIsSettingsPopupVisible(true) }}
                        onMyArtist={() => { setIsSelectArtistPopupVisible(true) }}
                        selectedArtist={selectedArtist}
                    />
                    <ProjectsList 
                        artist={selectedArtist} 
                        onSelect={setSelectedProject}
                        onProjectsLoaded={(projects) => {
                            if (!selectedProject) {
                                setSelectedProject(projects[0]);
                            }
                        }}
                    />
                </div>
                <LinkSharingModal 
                    selectedProject={selectedProject}
                    isOpen={isSharingPopupVisible} 
                    onClose={() => setIsSharingPopupVisible(false)} 
                />
                {windowWidth > 850 && (  // (3) conditionally render art-section based on window width
                    <div className="album-art-section">
                        <AlbumArt 
                            project={selectedProject} 
                            onPlayProject={() => { playerRef.current.playProject() }}
                            onShareProject={async () => {
                                const currentUser = firebase.auth().currentUser;

                                if (currentUser && selectedProject.artist.members.includes(currentUser.uid)) {
                                    setIsSharingPopupVisible(true);
                                    return;
                                }

                                const url = selectedProject.generateSharableURL();
                                try {
                                    await navigator.clipboard.writeText(url);
                                    alert("Link copied.");
                                } catch (err) {
                                    alert("Failed to copy link.");
                                }
                            }}
                        />
                        <ProjectActivity project={selectedProject} />
                    </div>
                )}
                <div className="edit-project-section">
                    {selectedProject && windowWidth <= 850 && (  // (3) conditionally render art-section based on window width
                        <div className="mini-album-art-section">
                            <img src={selectedProject.imageUrl || placeholder} alt="Album Art" className="mini-album-image" />
                            <div className="mini-project-info">
                                <div className="mini-project-name">{selectedProject.name}</div>
                                <div className="mini-track-count">{selectedProject.numberOfTracks} tracks - {Helpers.formatDuration(selectedProject.duration)}</div>
                            </div>
                            <button className="project-play-btn" onClick={ () => { playerRef.current.playProject() }}>
                            <FontAwesomeIcon icon={faPlay}/>
                            </button>
                        </div>
                    )}
                    <EditProjectView 
                        project={selectedProject} 
                        tracks={tracks}
                        setTracks={setTracks}
                        currentTrack={currentTrack} 
                        setCurrentTrack={setCurrentTrack}
                    />
                </div>
            </div>
            <Player 
                ref={playerRef}
                tracks={tracks} 
                currentTrack={currentTrack} 
                setCurrentTrack={setCurrentTrack} 
            /> 
        </div>
    );
}

export default App;