import React from 'react';

const ArtView = ({ album }) => {
    const imageUrl = 'https://placeimg.com/640/480/music'; // Placeholder or fetch from a backend/API

    return (
        <div>
            <h2>Art</h2>
            <img src={imageUrl} alt="Project Art" width="300" />
        </div>
    );
};

export default ArtView;