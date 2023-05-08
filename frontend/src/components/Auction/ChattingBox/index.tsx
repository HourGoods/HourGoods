/* eslint-disable react/no-array-index-key */
import { UserCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

interface Props {
  socketList: string[];
}

export default function index({ socketList }: Props) {
  return (
    <div className="chattingbox-all-container">
      <div className="private-chatroom-content-container">
        {/* <div className="not-me-chat">
          <UserCircleIcon />
          <div className="not-me-chat-message">
            <p className="not-me-name">아이유사랑해</p>
            <p className="not-me-message">{messages}</p>
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
        </div> */}
        {socketList.map((msg: string, index: number) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
