import React, { useState, useEffect } from 'react';

const AlbumList = ({ artist, onSelect }) => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const retrievedAlbums = await artist.getSnapshotOfProjects();
                setAlbums(retrievedAlbums);
            } catch (error) {
                console.error("Error fetching albums:", error);
            }
        };
        fetchAlbums()
    }, [artist]);

    return (
        <div className="albums-list">
            {albums.map(album => (
                <div 
                    key={album.id} 
                    className="album-item" 
                    onClick={() => onSelect(album)}
                >
                    <img src={album.imageUrl} alt={album.title} />
                </div>
            ))}
        </div>
    );
};

export default AlbumList;