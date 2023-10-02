import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import NavBar from './NavBar';
function App() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);


    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            setProfile(codeResponse.profileObj);
            sendUserDataToAPI(codeResponse.profileObj);
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const sendUserDataToAPI = (userData) => {
        // Send user data to the backend API using Axios POST request
        axios.post('http://localhost:5000/api/user', userData)
            .then(response => {
                console.log('User data sent successfully:', response.data);
            })
            .catch(error => {
                console.error('Error sending user data:', error);
            });
    };

    const logOut = () => {
        googleLogout();
        setUser(null);
        setProfile(null);
    };

    return (
        <div>
            <NavBar/>
            <h2>React Google Login</h2>
            <br />
            <br />
            {user ? (
                <div>
                    <img src="#" alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: </p>
                    <p>Email Address:</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google 🚀 </button>
            )}
        </div>
        
    );
}

export default App;