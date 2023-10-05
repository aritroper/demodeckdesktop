import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import '../App.css';

const AlbumArt = ({ project }) => {
  if (!project) return null;

  // Placeholder image source and tracks
  const trackCount = project.numberOfTracks;
  const duration = project.duration;

  return (
    <div className="project-container">
      <img src={project.imageUrl} alt="Album Art" className="album-image" />
      <div className="project-info">
        <div>
          <div className="project-name">{project.name}</div>
          <div className="track-count">{trackCount} tracks - {duration}</div>
        </div>
        <button className="project-play-btn">
          <FontAwesomeIcon icon={faPlay}/>
        </button>
      </div>
    </div>
  );
};

export default AlbumArt;