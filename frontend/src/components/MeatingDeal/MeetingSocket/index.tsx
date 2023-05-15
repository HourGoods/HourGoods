import { UserStateAtom } from "@recoils/user/Atom";
import { Client, Message } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import SockJS from "sockjs-client";
import Map from "./Map";
import Loading from "./Loading";

export interface IMapProps {
  otherNickname: string; // 판매자이름
  otherLongitude: number; // 판매자경도
  otherLatitude: number; // 판매자위도
  distance: number; // 판매자와 구매자의 거리
}

// 소켓통신으로 수신받은 결과값을 저장한 인스턴스
export interface MeetingDealInfo {
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

  // 다솜: Map을 위한 props 입니다
  const [mapPropsState, setMapPropsState] = useState<IMapProps>({
    otherNickname: "", // 판매자이름
    otherLongitude: 0, // 판매자경도
    otherLatitude: 0, // 판매자위도
    distance: 0, // 판매자와 구매자의 거리
  });

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
          `/topic/meet/${dealId}/${userName}`,
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
    console.log("받아옵니다.")
    const parsedMessage = JSON.parse(message) as MeetingDealInfo;
    setMeetingInfo(parsedMessage);
  };

  return (
    <div>
      <Loading />
      <Map
        mapPropsState={mapPropsState}
        userName={userName}
        clientRef={clientRef}
        tradeLocId={tradeLocId}
      />
    </div>
  );
}
