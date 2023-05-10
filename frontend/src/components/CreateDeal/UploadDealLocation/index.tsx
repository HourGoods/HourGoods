/* eslint-disable */
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { dealState } from "@recoils/deal/Atoms";
import { concertDetailState } from "@recoils/concert/Atoms";
import { haversineDistance } from "@utils/realTime";

declare global {
  interface Window {
    kakao: any;
  }
}
export default function index() {
  const [dealInfo, setDealInfo] = useRecoilState(dealState);
  const concertDetailInfo = useRecoilValue(concertDetailState);

  const locationHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDealInfo((prev) => ({
      ...prev,
      meetingLocation: e.target.value,
    }));
  };

  useEffect(() => {
    const mapContainer = document.getElementById("map");

    // default는 종합운동장 기준 생성
    let mapOption = {
      center: new window.kakao.maps.LatLng(
        37.511806050815686,
        127.07376866170583
      ),
      level: 3,
    };
    const map = new window.kakao.maps.Map(mapContainer, mapOption);

    // 만약 dealInfo.concertId가 있다면 (콘서트 검색된 것임)
    if (dealInfo.concertId && dealInfo.concertId !== 0) {
      if (concertDetailInfo) {
        const newCenter = new window.kakao.maps.LatLng(
          concertDetailInfo.latitude,
          concertDetailInfo.longitude
        );
        // 등록된 치를 기준으로 지도 범위를 재설정합니다
        map.setCenter(newCenter);

        // 중심 좌표에 그림 그리기
        const circle = new window.kakao.maps.Circle();
        const circlePosition = new window.kakao.maps.LatLng(
          concertDetailInfo.latitude,
          concertDetailInfo.longitude
        );
        circle.setPosition(circlePosition);
        circle.setOptions({
          radius: 500,
          strokeWeight: 5,
          strokeColor: "#75B8F",
          strokeOpacity: 0,
          strokeStyle: "dashed",
          fillColor: "#6366F1",
          fillOpacity: 0.3,
        });

        circle.setMap(map);
      }
    }

    // 중심좌표로 거래할 마커 생성
    const currentCenter = map.getCenter();
    const markerPosition = new window.kakao.maps.LatLng(
      currentCenter.Ma,
      currentCenter.La
    );
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    // 중심좌표를 기준으로 최초 거래 위치 지정
    setDealInfo((prev) => ({
      ...prev,
      latitude: currentCenter.Ma,
      longitude: currentCenter.La,
    }));

    // Marker의 위치가 변경될 때마다 호출될 함수를 정의합니다
    function handleMarkerDragend() {
      const position = marker.getPosition(); // Marker의 현재 위치를 얻습니다

      // 콘서트가 있고, 500m 이내일때만 생성 가능
      if (concertDetailInfo.latitude && concertDetailInfo.latitude !== 0) {
        const distance = haversineDistance(
          concertDetailInfo.latitude,
          concertDetailInfo.longitude,
          position.getLat(),
          position.getLng()
        );
        if (distance <= 500) {
          setDealInfo((prev) => ({
            ...prev,
            latitude: position.getLat(),
            longitude: position.getLng(),
          }));
        } else {
          alert("콘서트 범위 내에서만 생성할 수 있습니다.");
          marker.setPosition(
            concertDetailInfo.latitude,
            concertDetailInfo.longitude
          );
        }
      } else {
        alert("콘서트를 먼저 선택해 주세요!");
      }
    }

    // Marker의 'dragend' 이벤트에 이벤트 핸들러를 등록합니다
    window.kakao.maps.event.addListener(marker, "dragend", handleMarkerDragend);

    marker.setDraggable(true);

    // 마커 위에 infoWindow

    const iwContent =
        '<div style="padding:5px; font-size:10px;">마커를 움직여 거래 장소를 지정할 수 있습니다</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
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
  }, [dealInfo.concertId, concertDetailInfo]);

  return (
    <div className="create-deal-location-component-container">
      <p>거래 장소</p>
      <input
        type="address"
        placeholder="예시) 8번 게이트 앞"
        value={dealInfo.meetingLocation}
        onChange={locationHandler}
      />
      <p className="deal-loc-help-text-p">
        ※ 지도에서 핀을 옮겨 거래 장소를 지정할 수 있습니다.
        <br /> ※ 콘서트 범위 내에서만 거래를 생성할 수 있습니다.
      </p>
      <div id="map" />
    </div>
  );
}
