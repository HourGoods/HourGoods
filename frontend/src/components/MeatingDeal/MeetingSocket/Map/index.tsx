import React, { useEffect, useState } from "react";
import meMarker from "@assets/userLocPoint.svg";
import youMarker from "@assets/otherUserLocPoint.svg";
import { IMapProps } from "..";

interface IMapPropsType {
  mapPropsState: IMapProps;
  userName: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map(props: IMapPropsType) {
  const { mapPropsState, userName } = props;
  const [map, setMap] = useState<any>(null);
  const [sellerMarker, setSellerMarker] = useState<any>(null);
  const [purchaserMarker, setPurchaserMarker] = useState<any>(null);
  const [sellerMarkerPosition, setSellerMarkerPosition] = useState<any>(null);
  const [purchaserMarkerPosition, setPurchaserMarkerPosition] =
    useState<any>(null);
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
    let sellerMarkerImage;
    let purchaserMarkerImage;
    if (userName === mapPropsState.sellerNickname) {
      console.log("판매자 중심!");
      options.center = new window.kakao.maps.LatLng(
        mapPropsState.sellerLatitude,
        mapPropsState.sellerLongitude
      );
      // 판매자에 내 이미지
      // marker images
      sellerMarkerImage = new window.kakao.maps.MarkerImage(
        meMarker, // 마커 이미지 URL
        new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
        {
          offset: new window.kakao.maps.Point(55, 55),
          alt: "내 위치",
        }
      );
      purchaserMarkerImage = new window.kakao.maps.MarkerImage(
        youMarker, // 마커 이미지 URL
        new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
        {
          offset: new window.kakao.maps.Point(55, 55),
          alt: "상대방 위치",
        }
      );
    } else {
      console.log("구매자 중심");
      options.center = new window.kakao.maps.LatLng(
        mapPropsState.purchaserLatitude,
        mapPropsState.purchaserLongitude
      );
      // 판매자에 내 이미지
      // marker images
      sellerMarkerImage = new window.kakao.maps.MarkerImage(
        youMarker, // 마커 이미지 URL
        new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
        {
          offset: new window.kakao.maps.Point(55, 55),
          alt: "내 위치",
        }
      );
      purchaserMarkerImage = new window.kakao.maps.MarkerImage(
        meMarker, // 마커 이미지 URL
        new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
        {
          offset: new window.kakao.maps.Point(55, 55),
          alt: "상대방 위치",
        }
      );
    }
    const map = new window.kakao.maps.Map(container, options);
    setMap(map);

    // 두 개의 marker 생성
    const tempSellerMarker = new window.kakao.maps.Marker({
      map,
      position: new window.kakao.maps.LatLng(
        mapPropsState.sellerLatitude,
        mapPropsState.sellerLongitude
      ),
      title: mapPropsState.sellerNickname,
      image: sellerMarkerImage,
    });

    const tempPurchaserMarker = new window.kakao.maps.Marker({
      map,
      position: new window.kakao.maps.LatLng(
        mapPropsState.purchaserLatitude,
        mapPropsState.purchaserLongitude
      ),
      title: mapPropsState.purchaserNickname,
      image: purchaserMarkerImage,
    });

    // 두 marker 정보 state에 저장
    setSellerMarker(tempSellerMarker);
    setPurchaserMarker(tempPurchaserMarker);

    // 마커 위치
    setSellerMarkerPosition({
      latitude: mapPropsState.sellerLatitude,
      longitude: mapPropsState.sellerLongitude,
    });
    setPurchaserMarkerPosition({
      latitude: mapPropsState.purchaserLatitude,
      longitude: mapPropsState.purchaserLongitude,
    });

    // 최초 로딩이 완료되었음
    setFlag(true);
  }, [mapPropsState.tradeLocationId, userName]);

  // map이 생성되었는지 여부를 확인하고, 갱신될때마다 위치 변경 시작!
  useEffect(() => {
    if (map && flag) {
      console.log("판매자 이동");
      if (sellerMarker) {
        sellerMarker.setMap(null);
      }
    }
  }, [mapPropsState.sellerLatitude, mapPropsState.sellerLongitude]);
  useEffect(() => {
    if (map && flag) {
      console.log("구매자 이동");
      if (purchaserMarker) {
        purchaserMarker.setMap(null);
      }
    }
  }, [mapPropsState.purchaserLatitude, mapPropsState.purchaserLongitude]);

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
