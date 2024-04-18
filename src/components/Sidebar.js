import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import renameIcon from "../images/rename.svg";

import "./Sidebar.css";

function Sidebar({
  chats,
  handleChatClick,
  loading,
  handleNewChatClick,
  handleChatDelete,
  handleChatSidebarRename,
}) {
  return (
    <div className="sidebar">
      <div className="header-sidebar">
        <div className="header-title">History</div>
        <div className="header-new-chat">
          <button onClick={() => handleNewChatClick()}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </div>
      </div>
      <div className="chat-histories-sidebar">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul style={{ paddingLeft: 0 }}>
            {chats.map((chat, index) => {
              const chatNumber = chat.id.split("-")[1];
              return (
                <>
                  <button
                    key={index}
                    className="chat-history-button"
                    onClick={() => handleChatClick(chatNumber)}
                  >
                    <li className="chat-history-sidebar">{chat.title}</li>
                    <div className="chat-rename-button">
                      <button
                        className="chat-rename-button"
                        onClick={() => handleChatSidebarRename(chatNumber)}
                      >
                        <img src={renameIcon} alt="Rename Icon" />
                      </button>
                    </div>
                    <div className="chat-delete-button">
                      <button
                        className="chat-delete-button"
                        onClick={() => handleChatDelete(chatNumber)}
                      >
                        <FontAwesomeIcon icon={faTrash} size="xl" />
                      </button>
                    </div>
                  </button>
                </>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
