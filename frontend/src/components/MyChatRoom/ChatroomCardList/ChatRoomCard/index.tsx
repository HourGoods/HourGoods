import React from "react";
import { Link } from "react-router-dom";

type ChatroomProps = {
  chatroom: {
    chattingRoomId: number;
    otherNickname: string;
    otherImageUrl: string;
    lastLogContent: string;
    lastLogTime: string;
  };
};

export default function ChatroomCard({ chatroom }: ChatroomProps) {
  return (
    <Link to={`/mychatroom/${chatroom.chattingRoomId}`}>
      <button className="chatromm-card-container" type="button">
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
    </Link>
  );
}
