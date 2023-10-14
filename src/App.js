import React, { useState, useRef, useEffect } from 'react';
import MenuBar from './components/MenuBar'
import ProjectsList from './components/ProjectList';
import AlbumArt from './components/AlbumArt';
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

function App() {
    const [isSelectArtistPopupVisible, setIsSelectArtistPopupVisible] = useState(false);
    const [isSettingsPopupVisible, setIsSettingsPopupVisible] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const playerRef = useRef();

    useEffect(() => {
        // This sets up a listener for changes in the auth state
        const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                // User is logged in
                const loggedInUser = await User.getUserById(user.uid);
                if (loggedInUser.artistIds.length > 0) {
                    const selectedArtist = await Artist.getArtistById(loggedInUser.artistIds[0]);
                    setSelectedArtist(selectedArtist);
                }
                setLoggedIn(true);
            } else {
                // User is logged out
                setLoggedIn(false);
            }
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();

    }, []);

    const handleLoginSuccess = async () => {
        const loggedInUser = await User.getUserById(firebase.auth().currentUser.uid);
        if (loggedInUser.artistIds.length > 0) {
            const selectedArtist = await Artist.getArtistById(loggedInUser.artistIds[0]);
            setSelectedArtist(selectedArtist);
            setLoggedIn(true);
        } else {
            setLoggedIn(true);
        }
    };

    const handleArtistSelect = (artist) => {
        setSelectedArtist(artist);
        setIsSelectArtistPopupVisible(false);
    };

    if (!loggedIn) {
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
                    <ProjectsList artist={selectedArtist} onSelect={setSelectedProject} />
                </div>
                <div className="art-section">
                    <AlbumArt 
                        project={selectedProject} 
                        onPlayProject={() => { playerRef.current.playProject() }}
                    />
                    <ProjectActivity project={selectedProject} />
                </div>
                <div className="edit-project-section">
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