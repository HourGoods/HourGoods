/* eslint-disable react/no-array-index-key */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { chattingAPI } from "@api/apis";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ChatroomCard from "./ChatRoomCard";
import "react-toastify/dist/ReactToastify.css";

export default function ChatroomList() {
  const navigate = useNavigate();
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    const req = chattingAPI.getmychatList();
    req
      .then((response) => {
        console.log("채팅목록 불러오는 api", response.data.result); // 채팅목록 불러오는 api
        setChatrooms(response.data.result);
      })
      .catch((err) => {
        const errStatus = err.response.data.status;
        if (errStatus === 401) {
          navigate("/");
          toast.error("로그인이 필요한 서비스입니다.");
        }
      });
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <div className="chatroom-card-list-container">
        <h1>나의 채팅목록</h1>
        <div className="chatroom-card-list-wrapper">
          <div className="chatroom-card-list-bottom">
            {chatrooms.length === 0 ? (
              <p className="chatroom-card-list-no-now-chatlist">
                진행중인 채팅이 없어요
              </p>
            ) : (
              chatrooms.map((chatroom, index) => (
                <ChatroomCard key={index} chatroom={chatroom} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
