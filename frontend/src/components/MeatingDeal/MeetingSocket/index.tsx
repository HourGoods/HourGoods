import { UserStateAtom } from "@recoils/user/Atom";
import { Client, Message } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import SockJS from "sockjs-client";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import Map from "./Map";
import Loading from "./Loading";

// 소켓통신으로 수신받은 결과값을 저장한 인스턴스
export interface MeetingDealInfo {
  messageType: string; // '판매자정보'인지 '종료된정보'인지 판별하는 트리거
  otherNickname: string; // 판매자이름
  otherLongitude: number; // 판매자경도
  otherLatitude: number; // 판매자위도
  distance: number; // 판매자와 구매자의 거리
}

interface Props {
  tradeLocId: string;
}

export default function index({ tradeLocId }: Props) {
  const location = useLocation();
  const dealId = location.state.dealid;
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname; // 내이름
  const [isConnected, setIsConnected] = useState(false);

  const navigate = useNavigate();

  // --------------------- 소켓 통신하기 -------------------------
  const clientRef = useRef<Client>();
  const [meetingInfo, setMeetingInfo] = useState<MeetingDealInfo>({
    messageType: "", // 메세지타입
    otherNickname: "", // 판매자이름
    otherLongitude: 0, // 판매자경도
    otherLatitude: 0, // 판매자위도
    distance: 0, // 판매자와 구매자의 거리
  });

  useEffect(() => {
    if (!clientRef.current) connect();
    return () => disconnect();
  }, []);

  // 소켓 연결
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
        setIsConnected(true); // 연결 상태 업데이트

        // 해당 소켓주소에 구독
        if (dealId !== null) {
          clientRef.current?.subscribe(
            `/topic/meet/${dealId}/${userName}`,
            (message: Message) => {
              handleMessage(message.body);
            }
          );
        }
      },
    });
    clientRef.current?.activate(); // client측 활성화
  };

  // 소켓 연결 종료
  const disconnect = () => {
    clientRef.current?.deactivate(); // client측 비활성화
  };

  // 소켓으로부터 받아오는 MeetingDealInfo 결과값
  const handleMessage = (message: string) => {
    const parsedMessage = JSON.parse(message) as MeetingDealInfo;
    // 판매자정보를 받아옵니다.
    if (parsedMessage.messageType === "Location") {
      setMeetingInfo(parsedMessage);
    }
    // 종료된 정보이면 소켓연결 종료 후 리다이렉트
    if (parsedMessage.messageType === "Done") {
      disconnect();
      alert("거래가 종료됩니다.");
      navigate("/mypage");
    }
  };

  return (
    <div className="meeting-socket-component-container">
      <button
        type="button"
        className="go-back-icon-text-container"
        onClick={() => navigate(-1)}
      >
        <ChevronDoubleLeftIcon />
        <p>채팅으로 돌아가기</p>
      </button>
      {isConnected ? (
        <Map
          meetingInfo={meetingInfo}
          userName={userName}
          clientRef={clientRef}
          tradeLocId={tradeLocId}
          dealId={dealId}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}
