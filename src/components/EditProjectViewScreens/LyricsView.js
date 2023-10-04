import React from 'react';

const LyricsView = ({ album }) => {
    // Sample data or fetch from a backend/API
    const lyrics = "Here are the lyrics for the selected track...";

    return (
        <div>
            <h2>Lyrics</h2>
            <pre>{lyrics}</pre>
        </div>
    );
};

export default LyricsView;