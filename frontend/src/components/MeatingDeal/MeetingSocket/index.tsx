import { UserStateAtom } from "@recoils/user/Atom";
import { Client, Message } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import SockJS from "sockjs-client";

// 소켓통신으로 수신받은 결과값을 저장한 인스턴스
export interface MeetingDealInfo {
  tradeLocationId: string;  // 상대방과나의 거래에 관한 객체 id값
  dealId: number; // 거래 id값
  sellerNickname: string; // 판매자이름
  sellerLongitude: number;  // 판매자경도
  sellerLatitude: number; // 판매자위도
  purchaserNickname: string;  // 구매자이름
  purchaserLongitude: number; // 구매자경도
  purchaserLatitude: number;  // 구매자위도
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

  // --------------------- 소켓 통신하기 -------------------------
  const clientRef = useRef<Client>();
  const [meetingInfo, setMeetingInfo] = useState<MeetingDealInfo>();

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
        // 해당 소켓주소에 구독
        clientRef.current?.subscribe(
          `/topic/meet/${dealId}`,
          (message: Message) => {
            handleMessage(message.body);
          }
        );
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
    setMeetingInfo(parsedMessage);
  };

  // 상대방에게 내 위도경도이름 보냅니다
  const sendLocation = () => {
    const message = {
      tradeLocationId: tradeLocId,
      nickname: userName,
      longitude: "채워주세용",
      latitude: "채워주세용",
    };
    const destination = `/pub/meet/${dealId}`;
    const body = JSON.stringify(message);
    // 해당 소켓주소로 메세지를 발행
    clientRef.current?.publish({ destination, body });
  };

  return (
    <div>
      <button onClick={sendLocation} type="button">
        내 위치를 보냅니당
      </button>
    </div>
  );
}
