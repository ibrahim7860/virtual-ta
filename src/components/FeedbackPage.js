import React, { useState } from 'react';
import './FeedbackPage.css';
import logo from '../images/logo.png';
import { db } from '../firebase';
import { collection, addDoc } from "firebase/firestore";

const FeedbackPage = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleRatingChange = (event) => {
        const newRating = event.target.value;
        setRating(newRating);
        console.log(newRating);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "feedback"), {
                rating: rating,
                comment: comment,
            });

            alert("Feedback submitted successfully!");
            setRating(0);
            setComment('');
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <div className="feedback-page">
            <img src={logo} alt="Logo" className="logo"/>
            <h1 style={{fontSize: '4rem', marginTop: '0.5rem'}}>How was VirtualTA?</h1>
            <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                    <React.Fragment key={i}>
                        <input
                            id={`star-${i + 1}`}
                            type="radio"
                            name="rating"
                            value={5 - i}
                            onChange={handleRatingChange}
                        />
                        <label htmlFor={`star-${i + 1}`}>★</label>
                    </React.Fragment>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="feedback-form">
                <label>
                    Additional comments:
                    <textarea value={comment} onChange={handleCommentChange}/>
                </label>
                <button type="submit">Send Feedback</button>
            </form>
        </div>
    );
};

export default FeedbackPage;