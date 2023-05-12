/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import InputMsgBox from "@components/common/InputMsgBox";
import over, { Client, Message } from "@stomp/stompjs";
import AuctionBox from "./AuctionBox";
import ChattingBox from "./ChattingBox";
import { UserStateAtom } from "@recoils/user/Atom";
import { useRecoilValue } from "recoil";
import { ChatBubbleOvalLeftIcon, TicketIcon } from "@heroicons/react/24/solid";
import { handleOnKeyPress } from "@utils/handleOnKeyPress";

export interface ChatMessage {
  messageType: string;
  imageUrl: string;
  nickname: string;
  content: string;
}

export interface BidMessage {
  messageType: string;
  currentBid: number;
  interval: number;
}

export interface InoutMessage {
  messageType: string;
  nickname: string;
  participantCount: number;
}

export default function index() {
  const location = useLocation();
  const dealId = location.state.dealid; // 해당 delaId값
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname;
  const [msgValue, setMsgValue] = useState("");
  const [bidValue, setBidValue] = useState("");

  // Socket 통신으로 받은 list 결과값 저장
  const [socketList, setsocketList] = useState<string[]>([]); // 소켓에서 한 번에 받는 메세지 저장
  const [msgList, setMsgList] = useState<ChatMessage[]>([]); // 채팅목록 저장
  const [bidList, setBidList] = useState<BidMessage[]>([]); // 응찰가격 저장
  const [inoutMsgList, setInoutMsgList] = useState<InoutMessage[]>([]); // JOIN, EXIT res값 저장

  // CHAT, BID, JOIN, EXIT response 값 저장
  const handleMessage = (message: string) => {
    setsocketList((prevsocketList) => [...prevsocketList, message]);
    const parsedMessage = JSON.parse(message);
    if (
      parsedMessage.messageType === "CHAT" ||
      parsedMessage.messageType === "JOIN" ||
      parsedMessage.messageType === "EXIT"
    ) {
      setMsgList((prevSocketList) => [...prevSocketList, parsedMessage]);
    } else if (parsedMessage.messageType === "BID") {
      setBidList((prevSocketList) => [...prevSocketList, parsedMessage]);
    } else if (
      parsedMessage.messageType === "JOIN" ||
      parsedMessage.messageType === "EXIT"
    ) {
      setInoutMsgList((prevSocketList) => [...prevSocketList, parsedMessage]);
    }
  };

  // 클라이언트 측 영역
  const clientRef = useRef<Client>();

  // 새로고침방지
  useEffect(() => {
    const preventClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", preventClose);
    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  // 최초렌더링시 Socket 통신이 되었는지 확인
  // clientRef가 없다면 socket에 연결
  useEffect(() => {
    if (!clientRef.current) connect();
    return () => disconnect();
  }, []);

  // Socket으로 받은 list의 결과가 바뀔 때마다 렌더링 작업
  useEffect(() => {
    // console.log("socket에서 받은 리스트", socketList);
    console.log("채팅리스트", msgList);
    // console.log("경매리스트", bidList);
  }, [socketList]);

  // Socket 연결
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
            handleMessage(message.body);
          }
        );
        sendJoinMessage(userName);
      },
    });
    clientRef.current?.activate(); // client측 활성화
  };

  // Socket 연결 끊기
  const disconnect = () => {
    console.log("소켓 연결이 끊어졌습니당");
    sendExitMessage(userName);
    clientRef.current?.deactivate(); // client측 비활성화
  };

  // Socket을 통해 메세지 보내기
  const sendMessage = () => {
    if (!msgValue) return; // 빈값 return
    const message = {
      nickname: userName,
      messageType: "CHAT",
      content: msgValue, // 채팅내용
    };
    const destination = `/app/send/${dealId}`;
    const body = JSON.stringify(message);

    clientRef.current?.publish({ destination, body });
    setMsgValue(""); // Input 초기화
  };

  // Socket을 통해 응찰하기
  const sendBid = () => {
    if (!bidValue) return; // 빈값 return
    const bidMoney = {
      nickname: userName,
      messageType: "BID",
      bidAmount: bidValue, // 응찰가격
    };
    const destination = `/app/send/${dealId}`;
    const body = JSON.stringify(bidMoney);

    clientRef.current?.publish({ destination, body });
    setBidValue(""); // Input 초기화
  };

  const sendJoinMessage = (nickname: string) => {
    const message = {
      nickname: nickname,
      messageType: "JOIN",
    };
    const destination = `/app/send/${dealId}`;
    const body = JSON.stringify(message);

    clientRef.current?.publish({ destination, body });
  };

  const sendExitMessage = (nickname: string) => {
    const message = {
      nickname: nickname,
      messageType: "EXIT",
    };
    const destination = `/app/send/${dealId}`;
    const body = JSON.stringify(message);

    clientRef.current?.publish({ destination, body });
  };

  return (
    <div className="auction-page-all-container">
      <AuctionBox bidList={bidList} inoutMsgList={inoutMsgList} />
      <ChattingBox msgList={msgList} inoutMsgList={inoutMsgList} />
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
              onKeyPress={handleOnKeyPress(sendBid)}
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
              onKeyPress={handleOnKeyPress(sendMessage)}
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
