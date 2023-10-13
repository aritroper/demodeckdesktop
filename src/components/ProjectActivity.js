import React, { useState, useEffect } from 'react';

const ProjectActivity = ({ project }) => {
    const [activity, setActivity] = useState([]);
    const [activityLabels, setActivityLabels] = useState({}); // Stores labels by activity id

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const projectActivity = await project.getSnapshotOfActivity(5);
                setActivity(projectActivity);
                
                // Fetch labels for each activity
                const labels = {};
                for (let act of projectActivity) {
                    labels[act.id] = await act.getLabel();
                }
                setActivityLabels(labels);
            } catch (error) {
                console.error("Error fetching activity:", error);
            }
        };

        fetchActivity();
    }, [project]);

    if (!project) return null;

    return (
        <ul className="activity-list">
            {activity.map(activity => (
                <li key={activity.id} className="activity-item">
                     <div className="activity-profile-pic">
                        {activity.senderName.split(' ').map(word => word[0]).join('')}
                     </div>
                    <span className="activity-text">{activityLabels[activity.id]}</span>
                </li>
            ))}
        </ul>
    );
};

export default ProjectActivity;