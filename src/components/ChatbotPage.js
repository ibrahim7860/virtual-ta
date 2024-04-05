import React, { useEffect, useRef, useState } from "react";
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
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./ChatbotPage.css";
import TypingIndicator from "./TypingIndicator";

const ChatbotPage = () => {
  const [message, setMessage] = useState("");
  const [currentChatHistory, setCurrentChatHistory] = useState([]);

  const [userChatHistory, setUserChatHistory] = useState([]);
  const [loadingHistory, setloadingHistory] = useState(true);
  const [canCreateNewChat, setCanCreateNewChat] = useState(true);

  const messagesEndRef = useRef(null);

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
      console.error("No user signed in.");
      return;
    }

    const userMessage = {
      text: message,
      sender: "user",
      timestamp: serverTimestamp(),
    };

    setMessage("");
    setCurrentChatHistory((currentChatHistory) => [
      ...currentChatHistory,
      userMessage,
    ]);

    const backendResponseText = await sendMessageToBackend(message);

    const responseMessage = {
      text: backendResponseText,
      sender: "bot",
      timestamp: serverTimestamp(),
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
    await addDoc(
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

    setCurrentChatHistory((currentChatHistory) => [
      ...currentChatHistory,
      responseMessage,
    ]);
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
        { timestamp: serverTimestamp() }
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
    messagesEndRef.current?.scrollIntoView();
    updateChatHistoryForCurrentChat();
    fetchUserHistory();
  }, [currentChatHistory]);

  return (
    <div className="chat-screen">
      <Sidebar
        chats={userChatHistory}
        handleChatClick={handleChatClick}
        loadingHistory={loadingHistory}
      />
      <div className="main-wrapper">
        {!loadingHistory ? (
          <div className="chat-container">
            <div className="chat-history">
              <div> CHAT {localStorage.getItem("currentChatInt")}</div>
              {currentChatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    msg.sender === "user" ? "user" : "bot"
                  }`}
                >
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
                <FontAwesomeIcon icon={faPaperPlane} size="2x" />
              </button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default ChatbotPage;
