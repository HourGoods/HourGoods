/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import InputMsgBox from "@components/common/InputMsgBox";
import over, { Client, Message } from "@stomp/stompjs";
import AuctionBox from "./AuctionBox";
import ChattingBox from "./ChattingBox";
import { UserStateAtom } from "@recoils/user/Atom";
import { ChatBubbleOvalLeftIcon, TicketIcon } from "@heroicons/react/24/solid";
import { useRecoilValue } from "recoil";

export default function index() {
  const location = useLocation();
  const dealId = location.state.dealid; // 해당 delaId값
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname;
  const [msgValue, setMsgValue] = useState("");
  const [bidValue, setBidValue] = useState("");

  // 메세지 받으면 AuctionBox 컴포넌트에 띄워주기
  const [messages, setMessages] = useState<string[]>([]);
  const handleMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const clientRef = useRef<Client>();

  // 최초렌더링시 소켓통신이 되었는지 확인
  useEffect(() => {
    if (!clientRef.current) connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const connect = () => {
    const serverUrl = "https://hourgoods.co.kr/ws";
    const socket = new SockJS(serverUrl);
    clientRef.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        authorization: localStorage.getItem("accessToken") || "",
      },
      onConnect: () => {
        console.log("소켓에 연결되었습니당");
        clientRef.current?.subscribe(
          `/bidding/${dealId}`,
          (message: Message) => {
            console.log(`Received message: ${message.body}`);
            handleMessage(message.body);
          }
        );
      },
    });
    clientRef.current?.activate(); // client측 활성화
  };

  const disconnect = () => {
    console.log("소켓 연결이 끊어졌습니당");
    clientRef.current?.deactivate(); // client측 비활성화
  };

  // Socket을 통해 메세지 보내기
  const sendMessage = () => {
    const message = {
      nickname: userName,
      messageType: "CHAT",
      content: msgValue,
    };
    const destination = `/app/send/${dealId}`;
    const body = JSON.stringify(message);

    clientRef.current?.publish({ destination, body });
    setMsgValue(""); // Input 초기화
    console.log(message);
  };

  // Socket을 통해 응찰하기
  const sendBid = () => {
    if (!bidValue) return;
    clientRef.current?.publish({
      destination: `/app/send/${dealId}`,
      body: bidValue,
    });
    setBidValue(""); // Input 초기화
    console.log(bidValue);
  };

  return (
    <div className="auction-page-all-container">
      <AuctionBox />
      <ChattingBox messages={messages} />
      <div className="a-page-inputbox-container">
        <div className="input-message-container">
          <div className="icon-message-wrapper">
            <TicketIcon />
            <input
              placeholder="경매가를 입력해주세요."
              value={bidValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBidValue(e.target.value)
              }
            />
          </div>
          <button type="button" onClick={sendBid}>
            확인
          </button>
        </div>
        <div className="input-message-container">
          <div className="icon-message-wrapper">
            <ChatBubbleOvalLeftIcon />
            <input
              placeholder="메세지를 입력해주세요."
              value={msgValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMsgValue(e.target.value)
              }
            />
          </div>
          <button type="button" onClick={sendMessage}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
