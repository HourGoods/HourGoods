import React, { useEffect, useState } from "react";
import getCurrentLocation from "@utils/getCurrentLocation";
import meMarker from "@assets/userLocPoint.svg";
import youMarker from "@assets/otherUserLocPoint.svg";
import { useLocation } from "react-router-dom";
import { IMapProps } from "..";

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
  const [sellerMarker, setSellerMarker] = useState<any>(null);
  const [purchaserMarker, setPurchaserMarker] = useState<any>(null);
  const [sellerMarkerPosition, setSellerMarkerPosition] = useState<any>(null);
  const [purchaserMarkerPosition, setPurchaserMarkerPosition] =
    useState<any>(null);

  const [myLocation, setMyLocation] = useState({});

  // 최초 map이 그려졌음을 표시하는 flag
  const [flag, setFlag] = useState(false);

  // 최초의 지도 그리기
  useEffect(() => {
    console.log("최초 지도 생성! 이후에는 생성되면 안 됨");
    const container = document.getElementById("map");
    // 임시 map 위치
    const options = {
      center: new window.kakao.maps.LatLng(37.501, 127.04), // 기본 위치
      level: 5,
    };
    // 판매자, 구매자 여부에 따라 Map 중심 이동
    console.log("일단 유저 네임이 있냐?", userName);

    const map = new window.kakao.maps.Map(container, options);
    setMap(map);
    getCurrentLocation()
      .then((response) => {
        if (typeof response === "string") {
          // 얘는 타입이 잘못된 애입니다
          console.error(response, "타입 오류");
          setMyLocation(response);
        } else {
          setMyLocation(response);
          const sendMyLocation = () => {
            const message = {
              nickname: userName,
              longtitude: response.longitude,
              latitude: response.latitude,
              tradeLocationId: tradeLocId,
            };
            const destination = `/pub/meet/${dealId}`;
            const body = JSON.stringify(message);

            clientRef.current?.publish({ destination, body });
          };
          sendMyLocation();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // 최초 로딩이 완료되었음
    setFlag(true);
  }, []);

  // map이 생성되었는지 여부를 확인하고, 갱신될때마다 위치 변경 시작!
  // 상대방
  // useEffect(() => {
  //   if (map && flag) {
  //     console.log("판매자 이동");
  //     if (sellerMarker) {
  //       sellerMarker.setMap(null);
  //     }
  //   }
  // }, [mapPropsState.sellerLatitude, mapPropsState.sellerLongitude]);

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
