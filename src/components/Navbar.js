import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { FaHome, FaComments, FaSignInAlt, FaSignOutAlt, FaThumbsUp } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleSignOut = () => {
        auth.signOut();
    };

    const handleChatClick = () => {
        if (currentUser) {
            if (currentUser.emailVerified) {
                navigate('/chat-page');
            }
            else {
                alert("Please verify your email to access the chat page");
            }
        }
        else {
            alert("Please sign in to access the chat page");
            navigate('/sign-in');
        }
    }

    return (
        <nav className="navbar">
            <h1 className="navbar-brand">VirtualTA</h1>
            <div className="navbar-links">
                <Link to="/" className="nav-link"><FaHome size={30} /></Link>
                <button className="nav-link" onClick={handleChatClick}><FaComments size={30} /></button>
                <Link to="/feedback" className="nav-link"><FaThumbsUp size={30} /></Link>
                {!currentUser ? (
                    <Link to="/sign-in" className="nav-link"><FaSignInAlt size={30} /></Link>
                ) : (
                    <Link to="/" className="sign-out-link" onClick={handleSignOut}><FaSignOutAlt size={30} /></Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
