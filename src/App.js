import React, { useState } from 'react';
import MenuBar from './components/MenuBar'
import ProjectsList from './components/ProjectList';
import AlbumArt from './components/AlbumArt';
import EditProjectView from './components/EditProjectView';
import ProjectActivity from './components/ProjectActivity';
import Player from './components/Player';
import Login from './components/Login';
import SelectArtistPopup from './components/SelectArtistPopup';

function App() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
        setLoggedIn(true);
    };

    const handleArtistSelect = (artist) => {
        setSelectedArtist(artist);
        setIsPopupVisible(false);
    };

    if (!loggedIn) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="app-wrapper">  {/* A new wrapping div */}
            <div className="app-container">
                {isPopupVisible && <SelectArtistPopup 
                    onSelect={handleArtistSelect}
                    onClose={() => setIsPopupVisible(false)}
                />}

                <div className="projects-section">
                    <MenuBar 
                        onLogOut={() => {/* Handle logout logic */}}
                        onSearch={() => {/* Handle search logic */}}
                        onMyArtist={() => { setIsPopupVisible(true) }}
                    />
                    <ProjectsList artist={selectedArtist} onSelect={setSelectedProject} />
                </div>
                <div className="art-section">
                    <AlbumArt project={selectedProject} />
                    <ProjectActivity project={selectedProject} />
                </div>
                <div className="edit-project-section">
                    <EditProjectView 
                        project={selectedProject} 
                        currentTrack={currentTrack} 
                        setCurrentTrack={setCurrentTrack} 
                    />
                </div>
            </div>
            <Player 
                project={selectedProject} 
                currentTrack={currentTrack} 
                setCurrentTrack={setCurrentTrack} 
            /> 
        </div>
    );
}

export default App;