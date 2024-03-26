import React, { useState } from 'react';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";
import homepage from "../images/homepage.png";
import './Register.css'

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (event) => {
        event.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Account created!");
                console.log(userCredential);
            }).catch((error) => {
            alert(error);
        })
    };

    return (
        <div>
            <div className="login-container">
                <h2>Create an account</h2>
                <form onSubmit={handleRegister}>
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
                        <button type="submit">Create Account</button>
                    </div>
                    <a href="/" className="login">Back to login</a>
                </form>
            </div>
            <img src={homepage} alt="homepage" className="homepage-image" />
        </div>
    );
}

export default Register;