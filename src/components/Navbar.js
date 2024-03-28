import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import './Navbar.css';

const Navbar = () => {
    const { currentUser } = useAuth();

    const handleSignOut = () => {
        auth.signOut();
    };

    return (
        <nav className="navbar">
            <h1 className="navbar-brand">VirtualTA</h1>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Homepage</Link>
                {!currentUser ? (
                    <Link to="/sign-in" className="nav-link">Sign In</Link>
                ) : (
                    <Link to="/" className="sign-out-link" onClick={handleSignOut}>Sign Out</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
