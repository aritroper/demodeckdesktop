import React, { useState } from 'react';
import logo from '../full-logo.png';
import firebase from '../firebaseConfig';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(username, password)
            .then((userCredential) => {
                onLoginSuccess();
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div className="full-page">
            <div className="login-container">
                <img src={logo} alt="Demodeck Icon" className="login-logo" />
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Email"
                    />
                    
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;