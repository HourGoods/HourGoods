/* eslint-disable object-shorthand */
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Client, Message } from "@stomp/stompjs";
import { chattingAPI, dealAPI } from "@api/apis";
import DealCard from "@components/common/DealCard";
import Button from "@components/common/Button";
import Modal from "@components/common/Modal";
import { handleOnKeyPress } from "@utils/handleOnKeyPress";
import { UserStateAtom } from "@recoils/user/Atom";
import { useRecoilValue } from "recoil";
import SockJS from "sockjs-client";
import InputMsgBox from "@components/common/InputMsgBox";
import ChatContent from "./ChatContent";

export interface PrivatChatMessage {
  nickname: string;
  isUser: boolean;
  sendTime: string;
  content: string;
}
interface DealInfoInterface {
  dealId: number;
  dealTypeName: string;
  endTime?: string;
  imageUrl: string;
  isBookmarked: boolean;
  limitation?: number;
  meetingLocation: string;
  price?: number;
  startTime: string;
  title: string;
}

export default function index() {
  const navigate = useNavigate();
  const location = useLocation();
  const dealId = location.state.dealid;
  const chattingRoomId = location.state.chatId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealInfo, setDealInfo] = useState<DealInfoInterface>({
    dealId: 0,
    dealTypeName: "",
    endTime: "",
    imageUrl: "",
    isBookmarked: false,
    limitation: 0,
    meetingLocation: "",
    price: 0,
    startTime: "",
    title: "",
  });

  const meetModalHandler = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log("개인채팅 state값", location.state);
    const chatReq = chattingAPI.getmychatMsg(chattingRoomId);
    chatReq
      .then((res) => {
        // 채팅내용 가져오기
        setChatMsgList(res.data.result);
        console.log("채팅내용가져오기", res.data.result);
        setNotMeName(res.data.result.nickname);
      })
      .catch((err) => {
        console.error(err);
      });
    const dealReq = dealAPI.getDealDeatail(dealId);
    dealReq
      .then((res) => {
        console.log(res.data.result);
        const getInfo = res.data.result;
        setDealInfo({
          dealId: getInfo.dealId,
          dealTypeName: getInfo.dealType,
          endTime: getInfo.endTime,
          imageUrl: getInfo.dealImageUrl,
          isBookmarked: getInfo.isBookmarked,
          limitation: getInfo.limitation,
          meetingLocation: getInfo.meetingLocation,
          price: getInfo.price,
          startTime: getInfo.startTime,
          title: getInfo.dealTitle,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  /** -----------------------채팅하기----------------------------------- */
  // 클라이언트 측 영역
  const clientRef = useRef<Client>();
  const [socketList, setsocketList] = useState<string[]>([]);
  const [chatMsgList, setChatMsgList] = useState<PrivatChatMessage[]>([]);
  const [msgValue, setMsgValue] = useState("");
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname;
  const [notMeName, setNotMeName] = useState("");

  const handleMessage = (message: string) => {
    setsocketList((prevSocketList) => [...prevSocketList, message]);
    const parsedMessage = JSON.parse(message) as PrivatChatMessage;
    // console.log(parsedMessage);
    setChatMsgList((prevSocketList) => [...prevSocketList, parsedMessage]);
  };

  useEffect(() => {
    if (!clientRef.current) connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    // console.log("소켓리스트", socketList);
    console.log("채팅리스트", chatMsgList);
  }, [socketList, chatMsgList]);

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
        // console.log("소켓에 연결되었습니당");
        clientRef.current?.subscribe(
          `/topic/chat/${chattingRoomId}`,
          (message: Message) => {
            handleMessage(message.body);
          }
        );
      },
    });
    clientRef.current?.activate(); // client측 활성화
  };

  // Socket 연결 끊기
  const disconnect = () => {
    // console.log("소켓 연결이 끊어졌습니당");
    clientRef.current?.deactivate(); // client측 비활성화
  };

  // Socket을 통해 메세지 보내기
  const sendMessage = () => {
    if (!msgValue) return; // 빈값 return
    const now = new Date();
    const message = {
      nickname: userName, // 닉네임
      chattingRoomId: chattingRoomId, // 채팅방 id
      sendTime: now.toISOString(), // 현재시간
      content: msgValue, // 채팅내용
    };
    const destination = "/pub/chat";
    const body = JSON.stringify(message);

    clientRef.current?.publish({ destination, body });
    setMsgValue(""); // Input 초기화
  };

  // 1:1 만남
  const goMeetingDeal = () => {
    navigate(`/meetingdeal/${dealId}`, {
      state: { dealid: dealId, chatRoomId: chattingRoomId },
    });
  };

  return (
    <>
      <div className="private-chatroom-all-container">
        <div className="private-chatroom-box-container">
          <div className="chatroom-dealcard">
            <DealCard dealInfo={dealInfo} />
          </div>
          <div className="box-upper-wrapper">
            <ChatContent chatMsgList={chatMsgList} userName={userName} />
          </div>
          <div className="box-bottom-wrapper">
            <InputMsgBox
              type="message"
              placeholder="메세지를 입력해주세요."
              value={msgValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMsgValue(e.target.value)
              }
              onKeyPress={handleOnKeyPress(sendMessage)}
              onConfirm={sendMessage}
            />
          </div>
        </div>
      </div>

      {/* 만나서 거래하기  */}
      {/* DealDetail 거래 혹은 경매 성공시 만나서 거래하기 버튼 활성화하기 -> location 써서 코드 고칠 것 */}
      <div className="meeting-deal-button-wrapper">
        <Button color="pink" onClick={meetModalHandler}>
          만나서 거래하기
        </Button>
      </div>
      <div className="meeting-deal-modal-container">
        {isModalOpen && (
          <Modal setModalOpen={setIsModalOpen}>
            <p>만나서 거래를 하시겠습니까?</p>
            <p>현재 위치가 상대방에게 공유됩니다.</p>
            <div className="meeting-modal-buttons">
              <Button
                size="small"
                color="indigo"
                // dealInfo.dealId 값으로 navigate 시킬 것
                onClick={goMeetingDeal}
              >
                예
              </Button>
              <Button
                size="small"
                color="white"
                onClick={() => setIsModalOpen(false)}
              >
                아니오
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
