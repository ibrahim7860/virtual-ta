import React, {useState} from 'react';
import {createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import {auth} from "../firebase";
import homepage from "../images/homepage.png";
import './Register.css'
import {useNavigate} from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isPasswordStrong = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasNonAlphas = /\W/.test(password);
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonAlphas;
    }

    const handleRegister = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }
        if (!isPasswordStrong(password)) {
            alert("Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters");
            return;
        }

        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            await sendEmailVerification(user);
            alert("Verification email sent. Please check your email.");

            let interval = setInterval(async () => {
                await user.reload();
                if (user.emailVerified) {
                    clearInterval(interval);
                    navigate("/enroll-mfa");
                }
            }, 2000);

            return () => clearInterval(interval);
        } catch (error) {
            alert(error.message);
        }
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
                        <button type="submit">CREATE ACCOUNT</button>
                    </div>
                    <a href="/sign-in" className="login">Back to login</a>
                </form>
            </div>
            <img src={homepage} alt="homepage" className="homepage-image" />
        </div>
    );
}

export default Register;