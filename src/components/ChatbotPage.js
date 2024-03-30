import React, { useEffect, useRef, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './ChatbotPage.css';

const ChatbotPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Function to send a message to the Flask backend
  const sendMessageToBackend = async (userMessage) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.generated_text;
    } catch (error) {
      console.error("Could not fetch the data from the backend: ", error);
      return "Sorry, I couldn't fetch the response.";
    }
  };

  // Function to send message and receive response
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    // Ensure the user is signed in
    if (!auth.currentUser) {
      console.error('No user signed in.');
      return;
    }

    const userMessage = {
      text: message,
      sender: 'user',
      timestamp: serverTimestamp(),
    };

    // Send the message to your backend and wait for a response
    const backendResponseText = await sendMessageToBackend(message);

    const responseMessage = {
      text: backendResponseText,
      sender: 'bot',
      timestamp: serverTimestamp(),
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
    if (auth.currentUser) {
      const q = query(collection(db, `${auth.currentUser.email}`), orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChatHistory(history);
      });

      return () => unsubscribe(); // Cleanup on unmount
    }
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
