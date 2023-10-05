import React, { useState } from 'react';
import TracksView from './EditProjectViewScreens/TracksView';
import ArtView from './EditProjectViewScreens/ArtView';
import LyricsView from './EditProjectViewScreens/LyricsView';
import IdeasView from './EditProjectViewScreens/IdeasView';

const EditProjectView = ({ project, currentTrack, setCurrentTrack }) => {
    const [selectedTab, setSelectedTab] = useState('tracks');

    let content;
    switch (selectedTab) {
        case 'tracks':
            content = <TracksView 
              project={project} 
              currentTrack={currentTrack} 
              setCurrentTrack={setCurrentTrack} 
            />;
            break;
        case 'lyrics':
            content = <LyricsView project={project} />;
            break;
        case 'art':
            content = <ArtView project={project} />;
            break;
        case 'ideas':
            content = <IdeasView project={project} />;
            break;
        default:
            content = <TracksView project={project} />;
            break;
    }

    return (
        <div>
            <div className="tab-bar">
              <button 
                className={selectedTab === 'tracks' ? 'active' : ''} 
                onClick={() => setSelectedTab('tracks')}
              >
              Tracks
              </button>
              <button 
                className={selectedTab === 'lyrics' ? 'active' : ''} 
                onClick={() => setSelectedTab('lyrics')}
              >
              Lyrics
              </button>
              <button 
                className={selectedTab === 'art' ? 'active' : ''} 
                onClick={() => setSelectedTab('art')}
              >
              Art
              </button>
              <button 
                className={selectedTab === 'ideas' ? 'active' : ''} 
                onClick={() => setSelectedTab('ideas')}
              >
              Ideas
              </button>
            </div>
            <div className="tab-content"> 
              {content}
            </div>
        </div>
    );
};

export default EditProjectView;