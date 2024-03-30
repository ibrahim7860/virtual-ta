import React, {useEffect, useState} from 'react';
import './Login.css';
import homepage from '../images/homepage.png';
import { auth } from '../firebase';
import {
    signInWithEmailAndPassword,
    getMultiFactorResolver,
    PhoneAuthProvider,
    RecaptchaVerifier, PhoneMultiFactorGenerator
} from "firebase/auth";
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                console.log("Recaptcha verified");
            }});

        window.recaptchaVerifier = recaptchaVerifier;
    }, []);

    const handleMFA = (error) => {

        const resolver = getMultiFactorResolver(auth, error);
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const appVerifier = window.recaptchaVerifier;

        const phoneInfoOptions = {
            multiFactorHint: resolver.hints[0],
            session: resolver.session
        };

        phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, appVerifier)
            .then((verificationId) => {
                const verificationCode = window.prompt('Please enter the verification code sent to your phone');
                const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
                const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
                return resolver.resolveSignIn(multiFactorAssertion);
            })
            .then(() => {
                navigate('/chat-page');
            })
            .catch((error) => {
                alert("Failed MFA sign in: " + error.message);
            });
    };


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
                if (error.code === 'auth/multi-factor-auth-required') {
                handleMFA(error);
            } else {
                alert(error.message);
            }
        })
    };

    return (
        <div>
            <div id="recaptcha-container"></div>
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
