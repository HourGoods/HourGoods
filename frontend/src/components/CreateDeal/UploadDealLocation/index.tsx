import React, { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}
export default function index() {
  useEffect(() => {
    const mapContainer = document.getElementById("map");
    const mapOption = {
      center: new window.kakao.maps.LatLng(
        37.511806050815686,
        127.07376866170583
      ),
      level: 3,
    };
    const map = new window.kakao.maps.Map(mapContainer, mapOption);

    const markerPosition = new window.kakao.maps.LatLng(
      37.511806050815686,
      127.07376866170583
    );
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    // Marker의 위치가 변경될 때마다 호출될 함수를 정의합니다
    function handleMarkerDragend() {
      const position = marker.getPosition(); // Marker의 현재 위치를 얻습니다
      console.log(
        `Marker의 위치는 (${position.getLat()}, ${position.getLng()}) 입니다.`
      );
    }

    // Marker의 'dragend' 이벤트에 이벤트 핸들러를 등록합니다
    window.kakao.maps.event.addListener(marker, "dragend", handleMarkerDragend);

    marker.setDraggable(true);
  }, []);

  return (
    <div className="create-deal-location-component-container">
      <p>주소</p>
      <input type="address" />
      <div id="map" />
    </div>
  );
}
