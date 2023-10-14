import React, { useState, useEffect } from 'react';
import placeholder from '../gradient-placeholder.png';

const ProjectList = ({ artist, onSelect }) => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const retrievedProjects = await artist.getSnapshotOfProjects();
                setProjects(retrievedProjects);
                if (retrievedProjects.length > 0) {
                    onSelect(retrievedProjects[0])
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [artist]);

    const handleImageLoad = (e) => {
        e.target.style.opacity = '1';
    }

    return (
        <div className="projects-list">
            {projects.map(project => (
                <div 
                    key={project.id} 
                    className="project-item" 
                    onClick={() => onSelect(project)}
                >
                    <img 
                        src={project.imageUrl || placeholder}
                        alt={project.name} 
                        onLoad={handleImageLoad}
                        style={{ opacity: 0, transition: 'opacity 0.5s', backgroundColor: 'gray' }}
                    />
                    <div className="tooltip">
                        <div className="tooltip-title">{project.name}</div>
                        <div className="tooltip-description">{project.numberOfTracks} tracks</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectList;