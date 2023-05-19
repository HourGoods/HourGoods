/* eslint-disable */
import markerImg from "@assets/userLocPoint.svg";

const watchCurrentLocation = (
  map: any,
  onUpdate: (location: { latitude: number; longitude: number }) => void,
  onError?: (error: any) => void
): number => {
  if (navigator.geolocation) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    let marker: any = null; // marker 변수 선언
    const id = navigator.geolocation.watchPosition(
      (position: any) => {
        onUpdate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        // marker 생성
        const markerImage = new window.kakao.maps.MarkerImage(
          markerImg, // 마커 이미지 URL
          new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
          {
            offset: new window.kakao.maps.Point(55, 55),
            alt: "현재 위치",
          }
        );
        const newMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          ),
          image: markerImage,
        });

        // 이전 marker 삭제 및 새로운 marker 지도에 추가
        if (marker) {
          marker.setMap(null);
        }
        marker = newMarker;
        marker.setMap(map);
      },
      onError || (() => {}),
      options
    );
    return id;
  } else {
    onError && onError("Geolocation이 지원되지 않습니다.");
    return 0;
  }
};

export default watchCurrentLocation;
