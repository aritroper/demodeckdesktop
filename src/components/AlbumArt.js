import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import Marquee from "react-fast-marquee";
import placeholder from '../gradient-placeholder.png';
import Helpers from '../Helpers';
import '../App.css';

const AlbumArt = ({ project, onPlayProject }) => {
  const marqueeSpaceGap = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  useEffect(() => {
    let timer;
    if (isMarqueePaused) {
      timer = setTimeout(() => {
        setIsMarqueePaused(false);
      }, 3000); // Pause for 3 seconds (3000 milliseconds)
    }

    return () => clearTimeout(timer);
  }, [isMarqueePaused]);

  if (!project) return null;

  const trackCount = project.numberOfTracks;
  const duration = project.duration;

  return (
    <div className="project-container">
      <img src={project.imageUrl || placeholder} alt="Album Art" className="album-image" />
      <div className="project-info">
        <div>
          {project.name.length > 15 ? (
            <Marquee 
              speed = {30} 
              delay={2} 
              play={!isMarqueePaused}
              onCycleComplete={() => setIsMarqueePaused(true)}
              className="project-name">
                {project.name + marqueeSpaceGap}
            </Marquee>
          ) : (
            <div className="project-name">{project.name}</div>
          )}
          <div className="track-count">{trackCount} tracks - {Helpers.formatDuration(project.duration)}</div>
        </div>
        <button className="project-play-btn" onClick={onPlayProject}>
          <FontAwesomeIcon icon={faPlay}/>
        </button>
      </div>
    </div>
  );
};

export default AlbumArt;