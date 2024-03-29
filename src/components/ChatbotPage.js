import React, {useEffect, useRef, useState} from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './ChatbotPage.css';

const ChatbotPage = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const messagesEndRef = useRef(null);

    // Function to send message to backend and receive response
    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = {
            text: message,
            sender: 'user',
            timestamp: serverTimestamp()
        };

        // Example: Send `message` to your backend and wait for a response
        // const responseMessage = await sendMessageToBackend(message);
        const responseMessage = {
            text: "This is a response from the backend.",
            sender: 'bot',
            timestamp: serverTimestamp()
        };

        // Save messages to Firestore
        await addDoc(collection(db, `${auth.currentUser.email}`), userMessage);
        await addDoc(collection(db, `${auth.currentUser.email}`), responseMessage);

        // Update local chat history state
        setChatHistory([...chatHistory, userMessage, responseMessage]);

        // Clear input field
        setMessage('');
    };

    // Function to load chat history from Firestore on component mount
    useEffect(() => {
        const q = query(collection(db, `${auth.currentUser.email}`), orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setChatHistory(history);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
        <div className="main-wrapper">
        <div className="chat-container">
            <div className="chat-history">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} className="send-button" style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', marginLeft: '5px' }}>
                    <FontAwesomeIcon icon={faPaperPlane} size="2x" />
                </button>
            </div>
        </div>
        </div>
    );
};

export default ChatbotPage;
