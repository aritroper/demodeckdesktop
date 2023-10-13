import React from 'react';

const MenuBar = ({ onLogOut, onSearch, onMyArtist, selectedArtist }) => {
    return (
        <div className="menu-bar">
            <button className="menu-button" onClick={onLogOut}>🚪</button>  {/* Placeholder icon for "log out" */}
            <button className="menu-button" onClick={onSearch}>🔍</button>  {/* Placeholder icon for "search" */}
            
            {/* Display the circle with the initials of the artist */}
            <button className="menu-button" onClick={onMyArtist}>
                {selectedArtist ? 
                    <div className="artist-circle">{selectedArtist.getInitials()}</div>
                    : '🏠'  /* Placeholder icon for "my artist" */}
            </button>
        </div>
    );
};

export default MenuBar;