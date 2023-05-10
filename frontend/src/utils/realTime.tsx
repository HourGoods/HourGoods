/**
 * 두 지점 간의 거리(m)를 계산하는 함수
 * @param concertLat 지점 1의 위도
 * @param concertLng 지점 1의 경도
 * @param myLat 지점 2의 위도
 * @param myLng 지점 2의 경도
 * @returns 지점 1과 지점 2 간의 거리(m)
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

/**
 * 콘서트장의 위도, 경도와 현재 위치의 위도, 경도를 받아서,
 * 현재 위치가 콘서트장의 위도, 경도를 중심으로 500m 이내에 있는지 확인하는 함수
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
  concertId: number
): Promise<any> {
  const isWithin500m = distance <= 460;
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
    radius: 460,
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

export async function deleteCircle(
  circle: any,
  concertLat: number,
  concertLng: number,
  map: any,
  concertId?: number
): Promise<any> {
  const circlePosition = new window.kakao.maps.LatLng(concertLat, concertLng);
  circle.setPosition(circlePosition);
  circle.setMap(null);

  console.log(circle, "이게 원이라고?");

  return map;
}
