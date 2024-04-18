import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { db, auth } from "../firebase";
import Sidebar from "./Sidebar";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  addDoc,
  orderBy,
  query,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import "./ChatbotPage.css";
import TypingIndicator from "./TypingIndicator";
import ReactMarkdown from "react-markdown";


const ChatbotPage = () => {
  const [message, setMessage] = useState("");
  const [currentChatHistory, setCurrentChatHistory] = useState([]);
  const [userChatHistory, setUserChatHistory] = useState([]);
  const [loadingHistory, setloadingHistory] = useState(true);
  const [canCreateNewChat, setCanCreateNewChat] = useState(true);
  const [ratings, setRatings] = useState({});

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    console.log("SCROLLING");
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessageToBackend = async (userMessage) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseObject = await response.json();
      console.log(responseObject.text)
      return responseObject.text;
    } catch (error) {
      console.error("Could not fetch the data from the backend: ", error);
      return "Sorry, I couldn't fetch the response.";
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    if (!auth.currentUser) {
      console.error("No user signed in.");
      return;
    }

    const userMessage = {
      text: message,
      sender: "user",
      timestamp: serverTimestamp(),
      
    };

    const typingMessage = {
      text: "...",
      sender: "bot",
      timestamp: serverTimestamp(),
      isTyping: true,
    };

    setMessage("");
    setCurrentChatHistory((currentChatHistory) => [
      ...currentChatHistory,
      userMessage,
      typingMessage,
    ]);

    const backendResponseText = await sendMessageToBackend(message);
    console.log("Backend response text to be added:", backendResponseText);

    setCurrentChatHistory((currentChatHistory) =>
      currentChatHistory.filter((msg) => !msg.isTyping)
    );

    const responseMessage = {
      text: backendResponseText,
      sender: "bot",
      timestamp: serverTimestamp(),
      rating: "none",
      id: "" // Placeholder, will be replaced by actual document ID

    };

    await addDoc(
      collection(
        db,
        "users",
        `${auth.currentUser.email}`,
        "chats",
        `${auth.currentUser.email}-${localStorage.getItem("currentChatInt")}`,
        "messages"
      ),
      userMessage
    );
    const responseMsgRef = await addDoc(
      collection(
        db,
        "users",
        `${auth.currentUser.email}`,
        "chats",
        `${auth.currentUser.email}-${localStorage.getItem("currentChatInt")}`,
        "messages"
      ),
      responseMessage
    );

    setCurrentChatHistory(currentChatHistory =>
      currentChatHistory.filter(msg => !msg.isTyping).concat([
        {...responseMessage, id: responseMsgRef.id}
      ])
    );

  };

  const updateRating = async (messageId, newRating) => {
    if (!messageId) {
        console.error("Message ID is undefined.");
        return;
    }

    // Get the current rating from state
    const currentRating = ratings[messageId];

    // Toggle the rating: if the same button is clicked, remove the rating; otherwise, update it
    const updatedRating = currentRating === newRating ? "none" : newRating;

    const messageRef = doc(db, "users", auth.currentUser.email, "chats", `${auth.currentUser.email}-${localStorage.getItem("currentChatInt")}`, "messages", messageId);

    try {
        await setDoc(messageRef, { rating: updatedRating }, { merge: true });
        setRatings(prev => ({ ...prev, [messageId]: updatedRating }));
        console.log("Rating updated successfully");
    } catch (error) {
        console.error("Error updating rating: ", error);
    }
};



  const getNextInteger = (docs) => {
    let maxInteger = 0;
    docs.forEach((doc) => {
      const idParts = doc.id.split("-");
      const integerPart = parseInt(idParts[idParts.length - 1]);
      if (!isNaN(integerPart) && integerPart > maxInteger) {
        maxInteger = integerPart;
      }
    });
    return maxInteger + 1;
  };

  const handleChatDelete = async (chatNumber) => {
    updateChatHistoryForCurrentChat();

    try {
      const docRef = doc(
        db,
        "users",
        `${auth.currentUser.email}`,
        "chats",
        `${auth.currentUser.email}-${chatNumber}`
      );

      // Delete the document
      await deleteDoc(docRef);

      console.log("Chat document deleted successfully");
    } catch (error) {
      console.error("Error deleting chat document: ", error);
    }

    const updatedUserChatHistory = userChatHistory.filter(
      (chat) => chat.id !== `${auth.currentUser.email}-${chatNumber}`
    );

    setUserChatHistory(updatedUserChatHistory);
    handleNewChatClick();
  };

  const handleChatClick = async (chatNumber) => {
    updateChatHistoryForCurrentChat();

    const q = query(
      collection(
        db,
        "users",
        `${auth.currentUser.email}`,
        "chats",
        `${auth.currentUser.email}-${chatNumber}`,
        "messages"
      ),
      orderBy("timestamp", "asc")
    );

    const querySnapshot = await getDocs(q); // Retrieve one-time snapshot of documents
    const messagesForChat = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    localStorage.setItem("currentChatInt", chatNumber);
    setCurrentChatHistory(messagesForChat);
  };

  const createNewChat = async (userChatHistory) => {
    const nextIntValue = getNextInteger(userChatHistory);
    localStorage.setItem("nextInt", nextIntValue);
    localStorage.setItem("currentChatInt", nextIntValue);

    const documentID = `${auth.currentUser.email}-${nextIntValue}`;

    try {
      await setDoc(
        doc(db, "users", `${auth.currentUser.email}`, "chats", documentID),
        { timestamp: serverTimestamp(), title: "Enter Title For Chat..." }
      );
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const fetchUserHistory = async () => {
    setloadingHistory(true);
    const q = query(
      collection(db, "users", `${auth.currentUser.email}`, "chats"),
      orderBy("timestamp", "asc")
    );

    const querySnapshot = await getDocs(q); // Retrieve one-time snapshot of documents
    const allChatsForUser = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUserChatHistory(allChatsForUser);
  };

  //When user history fetched and loaded into state array, set loadingHistory to false
  useEffect(() => {
    setloadingHistory(false);
  }, [userChatHistory]);

  //When user loads page, fetch user history - loadingHistory is true when component loads
  useEffect(() => {
    if (auth.currentUser) {
      if (loadingHistory) {
        fetchUserHistory();
      }
    }
  }, []);

  //When loadingHistory changes, if loadingHistory is false, then create a new chat
  useEffect(() => {
    if (!loadingHistory && canCreateNewChat) {
      createNewChat(userChatHistory);

      setCanCreateNewChat(false);
    }
  }, [loadingHistory]);

  const updateChatHistoryForCurrentChat = () => {
    const index = userChatHistory.findIndex(
      (chat) =>
        chat.id ===
        `${auth.currentUser.email}-${localStorage.getItem("currentChatInt")}`
    );
    if (index !== -1) {
      setUserChatHistory((prev) => {
        const updatedUserChatHistory = [...prev];
        updatedUserChatHistory[index] = {
          ...updatedUserChatHistory[index],
          messages: currentChatHistory,
        };
        return updatedUserChatHistory;
      });
    }
  };

  useEffect(() => {
    updateChatHistoryForCurrentChat();
    fetchUserHistory();
  }, [currentChatHistory]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [currentChatHistory]);

  const handleNewChatClick = () => {
    createNewChat(userChatHistory);
    setCurrentChatHistory([]);
  };

  return (
    <div className="chat-screen">
      <Sidebar
        chats={userChatHistory}
        handleChatClick={handleChatClick}
        loadingHistory={loadingHistory}
        handleNewChatClick={handleNewChatClick}
        handleChatDelete={handleChatDelete}
      />
      {!loadingHistory ? (
        <div className="chat-container">
          <div className="chat-history">
            <div
              style={{
                fontFamily: 'DM Sans", sans-serif',
                fontWeight: "bold",
                fontSize: "30px",
                color: "white",
              }}
            >
              <div>Chat - {localStorage.getItem("currentChatInt")}</div>
            </div>
            {currentChatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}>
                {msg.isTyping ? (
                  <TypingIndicator />
                ) : msg.sender === "bot" ? (
                  <>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    <div style={{ display: "flex", justifyContent: "left" }}>
                      <button
                        onClick={() => updateRating(msg.id, 'up')}
                        className={`rating-button ${ratings[msg.id] === 'up' ? 'active' : ''}`}
                        style={{ animation: ratings[msg.id] === 'up' ? 'buttonClickAnimation 0.5s' : 'none' }}>
                        <FontAwesomeIcon icon={faThumbsUp} color={ratings[msg.id] === 'up' ? 'black' : 'lightgrey'} />
                      </button>
                      <button
                        onClick={() => updateRating(msg.id, 'down')}
                        className={`rating-button ${ratings[msg.id] === 'down' ? 'active' : ''}`}
                        style={{ animation: ratings[msg.id] === 'down' ? 'buttonClickAnimation 0.5s' : 'none' }}>
                        <FontAwesomeIcon icon={faThumbsDown} color={ratings[msg.id] === 'down' ? 'black' : 'lightgrey'} />
                      </button>
                    </div>
                  </>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="send-button"
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
                marginLeft: "5px",
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} size="2x" color="white" />
            </button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ChatbotPage;




