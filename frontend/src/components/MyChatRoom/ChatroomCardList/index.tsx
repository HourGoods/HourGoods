import React from "react";
import ChatroomCard from "./ChatRoomCard";

export default function index() {
  return (
    <div className="chatroom-card-list-container">
      <h1>나의 채팅목록</h1>
      <div className="chatroom-card-list-wrapper">
        <ChatroomCard />
        <ChatroomCard />
        <ChatroomCard />
        <ChatroomCard />
        <ChatroomCard />
        <ChatroomCard />
        <ChatroomCard />
      </div>
    </div>
  );
}
