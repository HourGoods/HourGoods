import markerImg from "@assets/userLocPoint.svg";

// 현재 위치 반환 함수
export const getCurrentLocation = (): Promise<
  { latitude: number; longitude: number } | string
> => {
  return new Promise<{ latitude: number; longitude: number } | string>(
    (resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            resolve("위치 정보를 가져올 수 없습니다.");
          }
        );
      } else {
        resolve("Geolocation이 지원되지 않습니다.");
      }
    }
  );
};

// 현재 위치 지속 감시 및 표시 함수
export const watchCurrentLocation = (
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
      // onError || (() => {}),
      // options
    );
    return id;
  }
  // onError && onError("Geolocation이 지원되지 않습니다.");
  return 0;
};

/**
 * 두 지점 간의 거리(m)를 계산하는 함수
 * @param concertLat 콘서트 지점의 위도
 * @param concertLng 콘서트 지점의 경도
 * @param myLat 현재 지점의 위도
 * @param myLng 현재 지점의 경도
 * @returns 콘서트 지점과 유저 현재 지점 간의 거리(m)
 */
export function haversineDistance(
  concertLat: number,
  concertLng: number,
  myLat: number,
  myLng: number
): number {
  const R = 6371e3; // 지구 반지름(m)
  const φ1 = (concertLat * Math.PI) / 180; // 지점 1의 위도
  const φ2 = (myLat * Math.PI) / 180; // 지점 2의 위도
  const Δφ = ((myLat - concertLat) * Math.PI) / 180; // 위도 차이
  const Δλ = ((myLng - concertLng) * Math.PI) / 180; // 경도 차이

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

// 범위 기준 공통변수
const standardDistance = 500;

/**
 * 콘서트장의 위도, 경도와 현재 위치의 위도, 경도를 받아서,
 * 현재 위치가 콘서트장의 위도, 경도를 중심으로 500m 이내에 있다면 원을 그리는 함수
 * @param distance 콘서트장과 현재 위치 사이의 거리
 * @param concertLat 콘서트장의 위도
 * @param concertLng 콘서트장의 경도
 * @param myLat 현재 위치의 위도
 * @param myLng 현재 위치의 경도
 * @returns 현재 위치가 콘서트장의 위도, 경도를 중심으로 500m 이내에 있으면 true, 그렇지 않으면 false를 반환하는 Promise
 */

let circle: any;

export async function drawCircles(
  distance: number,
  concertLat: number,
  concertLng: number,
  map: any,
  concertId?: number
): Promise<any> {
  const concertRange = standardDistance + 30; // 지도 UI의 오차를 감안한 30m 추가
  const isWithin500m = distance <= concertRange;
  let fillColor;

  if (isWithin500m) {
    fillColor = "#6366F1";
  } else {
    fillColor = "#8D8D8E";
  }

  circle = new window.kakao.maps.Circle();
  const circlePosition = new window.kakao.maps.LatLng(concertLat, concertLng);
  circle.setPosition(circlePosition);
  circle.setOptions({
    radius: concertRange + 50,
    strokeWeight: 5,
    strokeColor: "#75B8F",
    strokeOpacity: 0,
    strokeStyle: "dashed",
    fillColor,
    fillOpacity: 0.3,
  });

  circle.setMap(map);

  return map;
}
