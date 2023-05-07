import React, { useEffect } from "react";
import { chattingAPI } from "@api/apis";
import { useNavigate } from "react-router-dom";
import ChatroomCard from "./ChatRoomCard";

export default function index() {
  const navigate = useNavigate();
  useEffect(() => {
    const res = chattingAPI.getmychatList();
    res
      .then((response) => {
        console.log(response.data.result); // 채팅목록 불러오는 api
      })
      .catch((err) => {
        const errStatus = err.response.data.status;
        if (errStatus === 401) {
          alert("로그인이 필요한 서비스입니다.");
          navigate("/main");
        }
      });
  });

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
