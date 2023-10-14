import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

const MenuBar = ({ onSettings, onMyArtist, selectedArtist }) => {
    return (
        <div className="menu-bar">
            <button className="menu-button" onClick={onSettings}>
                <FontAwesomeIcon icon={faGear}/>
            </button>  {/* Placeholder icon for "log out" */}
            {/* Display the circle with the initials of the artist */}
            <button className="menu-button" onClick={onMyArtist}>
                {selectedArtist ? 
                    <>
                        <div className="artist-circle">{selectedArtist.getInitials()}</div>
                        <div className="tooltip">
                            <div className="tooltip-title">{selectedArtist.name}</div>
                            <div className="tooltip-description">Change Artist</div>
                        </div>
                    </>
                    : '🏠'  /* Placeholder icon for "my artist" */}
            </button>
         
        </div>
    );
};

export default MenuBar;