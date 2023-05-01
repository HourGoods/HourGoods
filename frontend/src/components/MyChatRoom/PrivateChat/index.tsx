import React from "react";
import DealCard from "@components/common/DealCard";
import InputMsgBox from "@components/common/InputMsgBox";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function index() {
  const sendMsgHandler = () => {
    //
  };
  return (
    <div className="private-chatroom-container">
      <h1>채팅방</h1>
      <div className="private-chatroom-box">
        <div className="dealcard-chattinglist-container">
          <DealCard />
          <div className="private-chat-message-container">
            <div className="not-me-chat">
              <UserCircleIcon />
              <div className="not-me-chat-message">
                <p className="not-me-name">아이유사랑해</p>
                <p className="not-me-message">남이 보낸 메세지</p>
              </div>
            </div>
            <div className="its-me-chat">
              <p>내가 보낸 메세지</p>
            </div>
          </div>
        </div>
        <InputMsgBox type="msg" onClick={sendMsgHandler} />
      </div>
    </div>
  );
}
