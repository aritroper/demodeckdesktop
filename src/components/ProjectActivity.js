import React from 'react';

const ProjectActivity = ({ project }) => {
    if (!project) return null;

    const activities = [
        { 
            id: '1', 
            activity: 'Track "Song A" uploaded on Sep 20, 2023', 
            profilePic: 'https://tinyurl.com/3ctz9nwu' 
        },
        { 
            id: '2', 
            activity: 'Track "Song B" uploaded on Sep 21, 2023', 
            profilePic: 'https://tinyurl.com/yk6vvkcw' 
        },
        // ... add more activities
    ];

    return (
        <ul className="activity-list">
            {activities.map(activity => (
                <li key={activity.id} className="activity-item">
                    <img src={activity.profilePic} alt="Profile" className="profile-pic"/>
                    <span className="activity-text">{activity.activity}</span>
                </li>
            ))}
        </ul>
    );
};

export default ProjectActivity;