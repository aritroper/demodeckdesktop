import React, { useState } from 'react';
import TracksView from './EditProjectViewScreens/TracksView';
import ArtView from './EditProjectViewScreens/ArtView';
import LyricsView from './EditProjectViewScreens/LyricsView';
import IdeasView from './EditProjectViewScreens/IdeasView';

const EditProjectView = ({ album, onSelectTrack }) => {
    const [selectedTab, setSelectedTab] = useState('tracks');

    let content;
    switch (selectedTab) {
        case 'tracks':
            content = <TracksView album={album} onSelectTrack={onSelectTrack} />;
            break;
        case 'lyrics':
            content = <LyricsView album={album} />;
            break;
        case 'art':
            content = <ArtView album={album} />;
            break;
        case 'ideas':
            content = <IdeasView album={album} />;
            break;
        default:
            content = <TracksView album={album} />;
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