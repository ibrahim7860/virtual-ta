import React, { useState } from 'react';
import './Login.css';
import homepage from '../images/homepage.png';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (user.emailVerified) {
                    navigate('/chat-page');
                } else {
                    alert("Please verify your email before logging in.");
                }
            }).catch((error) => {
                alert(error.message);
        })
    };

    return (
        <div>
            <div className="login-container">
                <h2>Login to your account</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <button type="submit">LOGIN</button>
                    </div>
                    <a href="/create-account" className="create-account">Don't have an account?</a>
                    <a href="/forgot-password" className="forgot-password">Forgot password?</a>
                </form>
            </div>
            <img src={homepage} alt="homepage" className="homepage-image" />
        </div>
    );
}

export default Login;
