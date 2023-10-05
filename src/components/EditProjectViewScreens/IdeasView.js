import React from 'react';

const IdeasView = ({ project }) => {
    // Sample data or fetch from a backend/API
    const ideas = [
        "Idea 1: Enhance the chorus.",
        "Idea 2: Add a guitar solo after the second verse.",
        // ...
    ];

    return (
        <div>
            <h2>Ideas</h2>
            <ul>
                {ideas.map((idea, index) => (
                    <li key={index}>{idea}</li>
                ))}
            </ul>
        </div>
    );
};

export default IdeasView;