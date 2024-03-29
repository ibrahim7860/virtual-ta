import { useState, useEffect } from 'react';
import {
    getAuth,
    RecaptchaVerifier,
    multiFactor as multiFactorInstance,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator
} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import Input from 'react-phone-number-input/input'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import homepage from "../images/homepage.png";
import {useAuth} from "../context/AuthContext";

function EnrollMFA() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                console.log("Recaptcha verified");
            }});

        window.recaptchaVerifier = recaptchaVerifier;

        return () => {
            if (recaptchaVerifier) {
                recaptchaVerifier.clear();
            }
        };
    }, []);

    const handleEnroll = () => {

        const appVerifier = window.recaptchaVerifier;
        if (!isPossiblePhoneNumber(phoneNumber)) {
            alert("Invalid phone number format. Please include the country code.");
            return;
        }

        multiFactorInstance(currentUser).getSession()
            .then((multiFactorSession) => {
                const phoneInfoOptions = {
                    phoneNumber: phoneNumber,
                    session: multiFactorSession
                };

                const phoneAuthProvider = new PhoneAuthProvider(auth);
                return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, appVerifier);
            })
            .then((verificationId) => {
                const code = window.prompt('Enter the OTP sent to your phone');
                const cred = PhoneAuthProvider.credential(verificationId, code);
                const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

                return multiFactorInstance(currentUser).enroll(multiFactorAssertion, phoneNumber);
            })
            .then(() => {
                alert('MFA setup successful.');
                navigate("/chat-page");
            })
            .catch((error) => {
                console.error('Error during MFA enrollment', error);
                alert("Error during MFA enrollment: " + error.message);
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