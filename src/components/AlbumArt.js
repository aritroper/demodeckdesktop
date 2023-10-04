import React from 'react';
import '../App.css';

const AlbumArt = ({ album }) => {
  if (!album) return null;

  // Placeholder image source and tracks
  const trackCount = album.numberOfTracks;
  const duration = album.duration;

  return (
    <div className="album-container">
      <img src={album.imageUrl} alt="Album Art" className="album-image" />
      <div className="album-info">
        <div className="album-name">{album.title}</div>  
        <div className="track-count">{trackCount} tracks - {duration}</div> 
      </div>
    </div>
  );
};

export default AlbumArt;