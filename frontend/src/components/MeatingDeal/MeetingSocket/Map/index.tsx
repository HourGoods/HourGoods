import React, { useEffect, useState } from "react";
import getCurrentLocation from "@utils/getCurrentLocation";
import watchCurrentLocation from "@utils/watchCurrentLocation";
import meMarker from "@assets/userLocPoint.svg";
import youMarker from "@assets/otherUserLocPoint.svg";
import { useLocation } from "react-router-dom";
import { IMapProps } from "../index";

interface IMapPropsType {
  mapPropsState: IMapProps;
  userName: string;
  clientRef: any;
  tradeLocId: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map(props: IMapPropsType) {
  const { mapPropsState, userName, clientRef, tradeLocId } = props;
  const location = useLocation();
  const dealId = location.state.dealid;
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

  // 최초의 지도 그리기
  useEffect(() => {
    console.log("tradeLocId", tradeLocId);
    // 임시 map 위치
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 위치
      level: 4,
    };
    const map = new window.kakao.maps.Map(container, options);
    setMap(map);
    // 마운팅이 된 상태라는 뜻
    setFlag(1);
  }, []);

  // 최초의 위치
  useEffect(() => {
    if (map && flag === 1) {
      console.log("여기는 맵은 있다");
      // 내 위치
      getCurrentLocation().then((res) => {
        if (typeof res === "object" && res !== null) {
          setMyLocation(res);
          map.setCenter(
            new window.kakao.maps.LatLng(res.latitude, res.longitude)
          );
          sendMyLocation(res.latitude, res.longitude);

          // 상대 위치 그리기
          // marker 생성
          const markerImage = new window.kakao.maps.MarkerImage(
            youMarker, // 마커 이미지 URL
            new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
            {
              offset: new window.kakao.maps.Point(55, 55),
              alt: "현재 위치",
            }
          );
          const newMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(
              mapPropsState.otherLatitude,
              mapPropsState.otherLongitude
            ),
            image: markerImage,
          });

          newMarker.setMap(map);
          setYourMarker(newMarker);

          // flag 2로 변경(너랑 내 최초 위치는 그려진 상태)
          setFlag(2);
          console.log("플래그 변경ㅋ");
        }
      });
    }
  }, [map, flag]);

  useEffect(() => {
    let watcher: number | undefined;
    if (map && flag === 2 && navigator.geolocation) {
      console.log("갱신 준비 완");

      watcher = watchCurrentLocation(map, (res: any) => {
        if (typeof res === "object" && res !== null) {
          sendMyLocation(res.latitude, res.longitude);
        }
      });
    }
  }, [map, flag, myLocation]);

  // map이 생성되었는지 여부를 확인하고, 갱신될때마다 위치 변경 시작!
  // 상대방
  useEffect(() => {
    if (map && flag) {
      console.log("판매자 이동");
      if (yourMarker) {
        console.log(
          mapPropsState.otherLatitude,
          mapPropsState.otherLongitude,
          "있다 야"
        );

        // yourMarker.setMap(null);
      }
    }
  }, [mapPropsState.otherLatitude, mapPropsState.otherLongitude]);

  return (
    <div>
      <p>{mapPropsState.distance}m 떨어져있습니다</p>
      {/* 크기는 원하는대로 변경 가능! */}
      <div
        id="map"
        style={{ width: "500px", height: "500px", margin: "auto" }}
      />
    </div>
  );
}
