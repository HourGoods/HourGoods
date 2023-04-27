import React, { useEffect, useState } from "react";
import getCurrentLocation from "@utils/getCurrentLocation";
import ConcertCard from "@components/common/ConcertCard";
import isWithin500mFromLocation from "@utils/isUserInConcertArea";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function index() {
  const [location, setLocation] = useState<
    { latitude: number; longitude: number } | string
  >("");

  // 위치 확인용 좌표
  const sillaLocation = {
    latitude: 37.504768995486,
    longitude: 127.04144944792,
  };

  const sjrStation = {
    latitude: 37.510257428761,
    longitude: 127.04391561527,
  };

  const gangnamStation = {
    latitude: 37.497,
    longitude: 127.0254,
  };

  // 현재 위치를 받아옴
  useEffect(() => {
    getCurrentLocation().then((result) => {
      setLocation(result);
    });
  }, []);

  useEffect(() => {
    if (location && location !== "" && typeof location !== "string") {
      const container = document.getElementById("map");

      // 현재 위치 기준으로 지도 생성
      const options = {
        center: new window.kakao.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        level: 4,
      };
      const map = new window.kakao.maps.Map(container, options);

      // 현재 위치를 표시하는 마커 생성
      const markerPosition = new window.kakao.maps.LatLng(
        location.latitude,
        location.longitude
      );
      console.log("현재위치", markerPosition, location.latitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        text: "현재 위치",
      });

      marker.setMap(map);

      // 현재 위치가 콘서트장 범위에 포함되는지 확인 후 색 지정
      isWithin500mFromLocation(
        sillaLocation.latitude,
        sillaLocation.longitude,
        location.latitude,
        location.longitude,
        map
      )
      isWithin500mFromLocation(
        sjrStation.latitude,
        sjrStation.longitude,
        location.latitude,
        location.longitude,
        map
      )
      isWithin500mFromLocation(
        gangnamStation.latitude,
        gangnamStation.longitude,
        location.latitude,
        location.longitude,
        map
      )
    }
  }, [location]);

  return (
    <div className="realtime-map-component-container">
      <p className="realtime-page-component-title-p">내 근처 Time Deal</p>
      <div id="map" />
      <ConcertCard />
    </div>
  );
}
