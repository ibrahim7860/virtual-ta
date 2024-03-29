import { useState } from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {useLocation, useNavigate} from "react-router-dom";
import Input from 'react-phone-number-input/input'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import homepage from "../images/homepage.png";

function EnrollMFA() {
    const location = useLocation();
    const { uid, email, emailVerified } = location.state;
    const [phoneNumber, setPhoneNumber] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();

    const setUpRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved - allow phoneNumber verification
                console.log("Recaptcha verified");
            }});
    };

    const handleEnroll = () => {
        setUpRecaptcha();

        const appVerifier = window.recaptchaVerifier;
        if (!isPossiblePhoneNumber(phoneNumber)) {
            alert("Invalid phone number format. Please include the country code.");
            return;
        }

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to enter the code from the message
                const code = window.prompt('Enter the OTP sent to your phone');
                return confirmationResult.confirm(code);
            })
            .then((result) => {
                // User signed in successfully.
                console.log('Phone number added to user', result.user);
                alert('MFA setup successful.');
                navigate("/chat-page");
            }).catch((error) => {
            // Error; SMS not sent
            console.error('Error during MFA enrollment', error);
        });
    };

    return (
        <div>
            <div id="recaptcha-container"></div>
            <div className="login-container">
                <h2>Verify your phone number</h2>
                <div className="input-group">
                    <Input
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={setPhoneNumber} />
                    <button onClick={handleEnroll}>Enroll for MFA</button>
                </div>
            </div>
            <img src={homepage} alt="homepage" className="homepage-image" />
        </div>
    );
}

export default EnrollMFA;