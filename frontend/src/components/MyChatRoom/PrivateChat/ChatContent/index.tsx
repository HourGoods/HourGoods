/* eslint-disable react/no-array-index-key */
import React from "react";
import { PrivatChatMessage } from "..";

interface Props {
  chatMsgList: PrivatChatMessage[];
}

// 23.05.10 10:40
// message.sendTime 추가할 것

export default function index({ chatMsgList }: Props) {
  return (
    <div className="private-chatroom-content-container">
      {chatMsgList.map((message: PrivatChatMessage, index: number) => {
        const isMe = message.isUser;
        const messageClassName = isMe ? "its-me-chat" : "not-me-chat";
        return (
          <div key={index} className={messageClassName}>
            {isMe ? (
              <p className="its-me-chatbox">{message.content}</p>
            ) : (
              <div className="not-me-chat-message">
                <p className="not-me-name">{message.nickname}</p>
                <p className="not-me-message">{message.content}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
