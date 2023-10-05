import React, { useState, useEffect } from 'react';

const ProjectList = ({ artist, onSelect }) => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const retrievedProjects = await artist.getSnapshotOfProjects();
                setProjects(retrievedProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects()
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
                        src={project.imageUrl} 
                        alt={project.name} 
                        onLoad={handleImageLoad}
                        style={{ opacity: 0, transition: 'opacity 0.5s', backgroundColor: 'gray' }}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProjectList;