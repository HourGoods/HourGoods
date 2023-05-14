import React from "react";
import { Link, useNavigate } from "react-router-dom";

type ChatroomProps = {
  chatroom: {
    chattingRoomId: number;
    dealId: number;
    otherNickname: string;
    otherImageUrl: string;
    lastLogContent: string;
    lastLogTime: string;
  };
};

export default function ChatroomCard({ chatroom }: ChatroomProps) {
  const navigate = useNavigate();

  const navigateChatroomHandler = () => {
    navigate(`/mychatroom/${chatroom.chattingRoomId}`, {
      state: {
        dealid: chatroom.dealId,
        chatId: chatroom.chattingRoomId,
        otherUsername: chatroom.otherNickname,
      },
    });
  };

  return (
    <button
      className="chatromm-card-container"
      type="button"
      onClick={navigateChatroomHandler}
    >
      <div className="chatroom-left-section">
        <img src={chatroom.otherImageUrl} alt="프로필이미지" />
      </div>
      <div className="chatroom-right-section">
        <div className="chatroom-name-datetime-container">
          <p className="chatroom-profile-name">{chatroom.otherNickname}</p>
          <p className="chatroom-recent-datetime">{chatroom.lastLogTime}</p>
        </div>
        <div className="chatroom-recent-msg-wrapper">
          <p className="recent-msg">{chatroom.lastLogContent}</p>
        </div>
      </div>
    </button>
  );
}
