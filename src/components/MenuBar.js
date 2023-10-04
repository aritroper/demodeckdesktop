import React from 'react';

const MenuBar = ({ onLogOut, onSearch, onMyArtist }) => {
    return (
        <div className="menu-bar">
            <button className="menu-button" onClick={onLogOut}>🚪</button>  {/* Placeholder icon for "log out" */}
            <button className="menu-button" onClick={onSearch}>🔍</button>  {/* Placeholder icon for "search" */}
            <button className="menu-button" onClick={onMyArtist}>🏠</button>  {/* Placeholder icon for "my artist" */}
        </div>
    );
};

export default MenuBar;