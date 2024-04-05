import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import "./Sidebar.css";

function Sidebar({ chats, handleChatClick, loading }) {
  return (
    <div className="sidebar">
      <div className="header-sidebar">
        <div className="header-title">History</div>
        <div className="header-new-chat">
          <button>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </div>
      </div>
      <div className="chat-histories-sidebar">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {chats.map((chat, index) => {
              const chatNumber = chat.id.split("-")[1];
              return (
                <button
                  key={index}
                  className="chat-history-button"
                  onClick={() => handleChatClick(chatNumber)}
                >
                  <li className="chat-history-sidebar">Chat {chatNumber}</li>
                </button>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
