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

  const [myLocation, setMyLocation] = useState({ latitude: 0, longitude: 0 });
  const [markers, setMarkers] = useState<any[]>([]);

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

    // 컴포넌트가 언마운트될 때 위치 정보 변경 감시를 정리함
    return () => {
      navigator.geolocation.clearWatch(watchLocation);
    };
  }, []);

  useEffect(() => {
    console.log("처음 마운팅, 이후엔 되면 안 됨");
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 위치
      level: 4,
    };
    const map = new window.kakao.maps.Map(container, options);
    setMap(map);
    setFlag(1); // map이 그려진 상태라는 뜻
  }, []);

  useEffect(() => {
    if (flag === 1 && map) {
      console.log("map있다");
      // 기존 마커들 제거
      markers.forEach((marker) => {
        marker.setMap(null);
      });

      // 마커 이미지
      const meMarkerImg = new window.kakao.maps.MarkerImage(
        meMarker, // 마커 이미지 URL
        new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
        {
          offset: new window.kakao.maps.Point(20, 40),
          alt: "현재 위치",
        }
      );
      // 마커 이미지
      const youMarkerImg = new window.kakao.maps.MarkerImage(
        youMarker, // 마커 이미지 URL
        new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
        {
          offset: new window.kakao.maps.Point(20, 40),
          alt: "현재 위치",
        }
      );

      // 새로운 마커들 생성 및 표시
      const positions = [
        {
          image: meMarkerImg,
          title: "내 위치",
          latlng: new window.kakao.maps.LatLng(
            myLocation.latitude,
            myLocation.longitude
          ),
        },
        {
          image: youMarkerImg,
          title: "상대방",
          latlng: new window.kakao.maps.LatLng(
            meetingInfo.otherLatitude,
            meetingInfo.otherLongitude
          ),
        },
      ];

      const newMarkers = positions.map((position) => {
        const markerOptions = {
          map,
          position: position.latlng,
          title: position.title,
          image: position.image,
        };

        const marker = new window.kakao.maps.Marker(markerOptions);
        return marker;
      });

      // 새로운 마커들을 상태에 업데이트
      setMarkers((prevMarkers) => {
        // 기존 마커들 제거
        prevMarkers.forEach((marker) => {
          marker.setMap(null);
        });

        // 이전 상태를 기반으로 새로운 상태 생성
        const updatedMarkers = [...newMarkers];
        return updatedMarkers;
      });
    }
  }, [myLocation, meetingInfo, flag, map]);

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
