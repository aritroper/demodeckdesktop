import React, { useState, useEffect } from 'react';
import Artist from '../models/Artist';
import firebase from '../firebaseConfig';

const SelectArtistPopup = ({ onSelect, onClose }) => {
    const [artists, setArtists] = useState([]);
    const [refresh, setRefresh] = useState(true); 

    const fetchArtists = async () => {
        try {
            const uId = firebase.auth().currentUser.uid;
    
            const snapshot = await firebase.database().ref("users")
                .child(uId).child("artists").once("value");
            const artists = snapshot.val();
            const artistPromises = Object.keys(artists).map((key) => {
                return Artist.getArtistById(key);  
            });
            
            const resolvedArtists = await Promise.all(artistPromises);
            setArtists(resolvedArtists);
        } catch (error) {
            console.error("Error fetching albums:", error);
        }
    };

    useEffect(() => {
        if (refresh) {
            fetchArtists();
            setRefresh(false);  // Reset the refresh state
        }
    }, [refresh]);

    return (
        <div className="popup">
            <div className="popup-content">
                <button className="close" onClick={onClose}>X</button>
                <h3>Change Artist</h3>
                <ul>
                    {artists.map(artist => (
                        <li key={artist.id} className="artist-item" onClick={() => onSelect(artist)}>
                            <div className="artist-image" />
                            <span className="artist-name">{artist.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SelectArtistPopup;