/* eslint-disable react/jsx-no-useless-fragment */
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

  const formatLastLogTime = (timestamp: string) => {
    const now = new Date();
    const logTime = new Date(timestamp);
    const diffInMinutes = Math.round(
      (now.getTime() - logTime.getTime()) / 60000
    );
    const diffInSeconds = Math.round(
      (now.getTime() - logTime.getTime()) / 1000
    );
    const diffInHours = Math.round(diffInMinutes / 60);
    const diffInDays = Math.round(diffInHours / 24);
    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }
    return `${diffInDays}일 전`;
  };

  const formattedLastLogTime = formatLastLogTime(chatroom.lastLogTime);

  return (
    <>
      {chatroom.lastLogContent && (
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
              <p className="chatroom-recent-datetime">{formattedLastLogTime}</p>
            </div>
            <div className="chatroom-recent-msg-wrapper">
              <p className="recent-msg">{chatroom.lastLogContent}</p>
            </div>
          </div>
        </button>
      )}
    </>
  );
}
