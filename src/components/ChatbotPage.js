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
import TypingIndicator from "./TypingIndicator";

const ChatbotPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

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

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    if (!auth.currentUser) {
      console.error('No user signed in.');
      return;
    }

    const userMessage = {
      text: message,
      sender: 'user',
      timestamp: serverTimestamp(),
    };

    setChatHistory(chatHistory => [...chatHistory, userMessage]);
    setMessage('');

    const typingMessage = {
      text: '...',
      sender: 'bot',
      timestamp: serverTimestamp(),
      isTyping: true,
    };

    setChatHistory(chatHistory => [...chatHistory, typingMessage]);

    const backendResponseText = await sendMessageToBackend(message);

    setChatHistory(chatHistory => chatHistory.filter(msg => !msg.isTyping));

    const responseMessage = {
      text: backendResponseText,
      sender: 'bot',
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, `${auth.currentUser.email}`), userMessage);
    await addDoc(collection(db, `${auth.currentUser.email}`), responseMessage);

    setChatHistory([...chatHistory, userMessage, responseMessage]);

    setMessage('');
  };

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, `${auth.currentUser.email}`), orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChatHistory(history);
      });

      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [chatHistory]);

  return (
    <div className="main-wrapper">
      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
              {msg.isTyping ? <TypingIndicator /> : msg.text}
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
