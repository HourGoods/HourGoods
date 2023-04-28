
/**
 * 두 지점 간의 거리(m)를 계산하는 함수
 * @param lat1 지점 1의 위도
 * @param lon1 지점 1의 경도
 * @param lat2 지점 2의 위도
 * @param lon2 지점 2의 경도
 * @returns 지점 1과 지점 2 간의 거리(m)
 */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // 지구 반지름(m)
  const φ1 = (lat1 * Math.PI) / 180; // 지점 1의 위도
  const φ2 = (lat2 * Math.PI) / 180; // 지점 2의 위도
  const Δφ = ((lat2 - lat1) * Math.PI) / 180; // 위도 차이
  const Δλ = ((lon2 - lon1) * Math.PI) / 180; // 경도 차이

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}

/**
 * 콘서트장의 위도, 경도와 현재 위치의 위도, 경도를 받아서,
 * 현재 위치가 콘서트장의 위도, 경도를 중심으로 500m 이내에 있는지 확인하는 함수
 * @param concertLat 콘서트장의 위도
 * @param concertLng 콘서트장의 경도
 * @param myLat 현재 위치의 위도
 * @param myLng 현재 위치의 경도
 * @returns 현재 위치가 콘서트장의 위도, 경도를 중심으로 500m 이내에 있으면 true, 그렇지 않으면 false를 반환하는 Promise
 */
async function isWithin500mFromLocation(
  concertLat: number,
  concertLng: number,
  myLat: number,
  myLng: number,
  map: any
): Promise<boolean> {
  const distance = haversineDistance(concertLat, concertLng, myLat, myLng);
  const isWithin500m = distance <= 500;
  let fillColor;
  if (isWithin500m) {
    fillColor = "#6366F1";
  } else {
    fillColor = "#374151";
  }
  const circle = new window.kakao.maps.Circle({
    center: new window.kakao.maps.LatLng(concertLat, concertLng), // 원의 중심좌표 입니다
    radius: 500, // 미터 단위의 원의 반지름입니다
    strokeWeight: 5, // 선의 두께입니다
    strokeColor: "#75B8FA", // 선의 색깔입니다
    strokeOpacity: 0, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: "dashed", // 선의 스타일 입니다
    fillColor, // 채우기 색깔입니다
    fillOpacity: 0.3, // 채우기 불투명도 입니다
  });
  circle.setMap(map);

  return map;
}

export default isWithin500mFromLocation;
