import React, {useState} from 'react';
import {auth} from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import homepage from "../images/homepage.png";
import './ForgotPassword.css'

function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handlePasswordReset = (event) => {
        event.preventDefault();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("A link to reset your password has been sent to your email!")
            }).catch((error) => {
            alert(error.message);
        })
    };

    return (
        <div>
            <div className="login-container">
                <h2>Reset account password</h2>
                <form onSubmit={handlePasswordReset}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <button type="submit">RESET PASSWORD</button>
                    </div>
                </form>
                <a href="/sign-in" className="login-page">Back to login</a>
                <a href="/create-account" className="create-account">Don't have an account?</a>
            </div>
            <img src={homepage} alt="homepage" className="homepage-image" />
        </div>
    );
}

export default ForgotPassword;