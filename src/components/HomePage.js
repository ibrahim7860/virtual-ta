import React from 'react';
import './HomePage.css';
import homescreen from '../images/homescreen.png'

const HomePage = () => {
    return (
        <div className="home">
            <section className="hero">
                <div>
                    <h2 style={{marginTop: '8%'}}>Welcome to VirtualTA</h2>
                    <p>Your AI-based teaching assistant, here to provide 24/7 support for students and educators.</p>
                    <h2 style={{marginTop: '10%'}}>About VirtualTA</h2>
                    <p>
                        VirtualTA is designed to automate responses to frequently asked student questions,
                        providing both basic and complex support. As an intelligent Chatbot, VirtualTA aims to
                        enhance the educational environment by being accurate, helpful, and available at any time.
                    </p>
                </div>
                <img src={homescreen} alt="Virtual Teaching Assistant" className="homescreen"/>
            </section>
        </div>
    );
};

export default HomePage;
