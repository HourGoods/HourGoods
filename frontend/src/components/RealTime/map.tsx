import React, { useEffect, useState } from "react";
import { getLocation } from "./getLocation";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map() {
  const [location, setLocation] = useState<
    { latitude: number; longitude: number } | string
  >("");

  useEffect(() => {
    getLocation().then((result) => {
      setLocation(result);
    });
  }, []);

  useEffect(() => {
    if (location && location !== "" && typeof location !== "string") {
      const container = document.getElementById("map");

      // 그리기
      const options = {
        center: new window.kakao.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);

      // 마커 생성
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
    }
  }, [location]);

  return (
    <div>
      <p>카카오</p>
      <div id="map" style={{ width: "500px", height: "400px" }} />
    </div>
  );
}
