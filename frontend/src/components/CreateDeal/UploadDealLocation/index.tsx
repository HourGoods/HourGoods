/* eslint-disable */
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

    // 마커 위에 infoWindow

    const iwContent =
        '<div style="padding:5px;">거래 장소를 지정해주세요!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      iwPosition = new window.kakao.maps.LatLng(
        37.511806050815686,
        127.07376866170583
      ); //인포윈도우 표시 위치입니다

    // 인포윈도우를 생성합니다
    const infowindow = new window.kakao.maps.InfoWindow({
      position: iwPosition,
      content: iwContent,
    });

    // 마커에 마우스오버 이벤트를 등록합니다
    window.kakao.maps.event.addListener(marker, "mouseover", function () {
      // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
      infowindow.open(map, marker);
    });

    // 마커에 마우스아웃 이벤트를 등록합니다
    window.kakao.maps.event.addListener(marker, "mouseout", function () {
      // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
      infowindow.close();
    });
  }, []);

  return (
    <div className="create-deal-location-component-container">
      <p>거래 장소</p>
      <div id="map" />
      <input type="address" placeholder="상세 위치" />
    </div>
  );
}
