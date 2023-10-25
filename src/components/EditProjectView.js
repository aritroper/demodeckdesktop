import React, { useState } from 'react';
import TracksView from './EditProjectViewScreens/TracksView';
import ArtView from './EditProjectViewScreens/ArtView';
import LyricsView from './EditProjectViewScreens/LyricsView';
import IdeasView from './EditProjectViewScreens/IdeasView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faFile, faImage, faMicrophone } from '@fortawesome/free-solid-svg-icons';

const EditProjectView = ({ project, tracks, setTracks, currentTrack, setCurrentTrack }) => {
    const [selectedTab, setSelectedTab] = useState('tracks');

    let content;
    switch (selectedTab) {
        case 'tracks':
            content = <TracksView 
              project={project} 
              tracks={tracks}
              setTracks={setTracks}
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
                <FontAwesomeIcon className="tab-icon" icon={faMusic}/>
                <span className="tab-text">Tracks</span>
              </button>

              <button 
                className={selectedTab === 'art' ? 'active' : ''} 
                onClick={() => setSelectedTab('art')}
              >
                <FontAwesomeIcon className="tab-icon" icon={faImage}/>
                <span className="tab-text">Art</span>  
              </button>

              <button 
                className={selectedTab === 'lyrics' ? 'active' : ''} 
                onClick={() => setSelectedTab('lyrics')}
              >
                <FontAwesomeIcon className="tab-icon" icon={faFile}/>
                <span className="tab-text">Lyrics</span>  
              </button>

              <button 
                className={selectedTab === 'ideas' ? 'active' : ''} 
                onClick={() => setSelectedTab('ideas')}
              >
                <FontAwesomeIcon className="tab-icon" icon={faMicrophone}/>
                <span className="tab-text">Ideas</span>  
              </button>
            </div>
            <div className="tab-content"> 
              {content}
            </div>
        </div>
    );
};

export default EditProjectView;