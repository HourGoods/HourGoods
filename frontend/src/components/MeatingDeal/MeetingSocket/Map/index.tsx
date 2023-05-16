import React, { useEffect, useState } from "react";
// import getCurrentLocation from "@utils/getCurrentLocation";
// import watchCurrentLocation from "@utils/watchCurrentLocation";
import meMarker from "@assets/userLocPoint.svg";
import youMarker from "@assets/otherUserLocPoint.svg";
import { useLocation } from "react-router-dom";
import { MeetingDealInfo } from "../index";

interface IMapPropsType {
  meetingInfo: MeetingDealInfo;
  userName: string;
  clientRef: any;
  tradeLocId: string;
  dealId: any;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map(props: IMapPropsType) {
  const { meetingInfo, userName, clientRef, tradeLocId, dealId } = props;
  const [map, setMap] = useState<any>(null);

  const [myLocation, setMyLocation] = useState({});
  const [yourMarker, setYourMarker] = useState();

  // 최초 map이 그려졌음을 표시하는 flag... 0: map만, 1: 최초지도, 2: 갱신상태
  const [flag, setFlag] = useState(0);

  // 내 위치 전송
  const sendMyLocation = (long: number, lat: number) => {
    const message = {
      nickname: userName,
      longitude: long,
      latitude: lat,
      tradeLocationId: tradeLocId,
    };
    const destination = `/pub/meet/${dealId}`;
    const body = JSON.stringify(message);

    clientRef.current?.publish({ destination, body });
  };


  useEffect(() => {
    // 위치 정보를 가져오는 함수
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setMyLocation(position.coords);
          sendMyLocation(longitude, latitude);
        },
        (error) => {
          console.error("Failed to get current location:", error);
        }
      );
    };

    // 위치 정보 변경 시 sendMyLocation 함수 자동 호출
    const watchLocation = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setMyLocation(position.coords);
        sendMyLocation(longitude, latitude);
      },
      (error) => {
        console.error("Failed to watch location:", error);
      }
    );

    getLocation();

    // 컴포넌트가 언마운트될 때 위치 정보 변경 감시를 정리합니다.
    return () => {
      navigator.geolocation.clearWatch(watchLocation);
    };
  }, []);

  return (
    <div>
      <p>{meetingInfo.distance}m 떨어져있습니다</p>
      {/* 크기는 원하는대로 변경 가능! */}
      <div
        id="map"
        style={{ width: "500px", height: "500px", margin: "auto" }}
      />
    </div>
  );
}
