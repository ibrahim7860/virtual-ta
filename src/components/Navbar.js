import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1 className="navbar-brand">VirtualTA</h1>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Homepage</Link>
                <Link to="/sign-in" className="nav-link">Sign In</Link>
            </div>
        </nav>
    );
};

export default Navbar;
