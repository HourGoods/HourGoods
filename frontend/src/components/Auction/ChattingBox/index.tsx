import { UserCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

export default function index() {
  return (
    <div className="chattingbox-all-container">
      <div className="private-chatroom-content-container">
        <div className="not-me-chat">
          <UserCircleIcon />
          <div className="not-me-chat-message">
            <p className="not-me-name">아이유사랑해</p>
            <p className="not-me-message">남이 보낸 메세지</p>
          </div>
        </div>
        <div className="not-me-chat">
          <UserCircleIcon />
          <div className="not-me-chat-message">
            <p className="not-me-name">아이유사랑해</p>
            <p className="not-me-message">남이 보낸 메세지</p>
          </div>
        </div>
        <div className="its-me-chat">
          <p className="its-me-chatbox">내가 보낸 메세지</p>
        </div>
        <div className="not-me-chat">
          <UserCircleIcon />
          <div className="not-me-chat-message">
            <p className="not-me-name">아이유사랑해</p>
            <p className="not-me-message">남이 보낸 메세지</p>
          </div>
        </div>
      </div>
    </div>
  );
}
