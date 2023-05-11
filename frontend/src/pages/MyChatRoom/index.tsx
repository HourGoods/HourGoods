/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./index.scss";
import bgStars from "@assets/BGstars.svg";
import ChatRoomCardList from "@components/MyChatRoom/ChatroomCardList";
import { useLocation } from "react-router-dom";

export default function index() {
  const location = useLocation();

  useEffect(() => {
    const bgColor =
      "linear-gradient(to bottom right, rgba(17,24,39, 1), rgba(49, 46, 129, 1))";
    const bgImage = `url(${bgStars})`;
    document.body.style.background = `${bgImage}, ${bgColor}`;

    return () => {
      document.body.style.background = "";
    };
  }, [location]);

  return (
    <div className="chatroom-container-upper">
      <div className="chatroom-container">
        <ChatRoomCardList />
      </div>
    </div>
  );
}
