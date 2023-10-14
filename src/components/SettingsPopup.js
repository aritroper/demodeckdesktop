import React from 'react';
import firebase from '../firebaseConfig';

const SettingsPopup = ({ onClose }) => {
    return (
        <div className={`popup`}>
            <div className="popup-content">
                <button className="close" onClick={onClose}>X</button>
                <h3>Settings</h3>
                <ul>
                    <li className="artist-item" onClick={() => firebase.auth().signOut()}>Logout</li>
                </ul>
            </div>
        </div>
    );
};

export default SettingsPopup;