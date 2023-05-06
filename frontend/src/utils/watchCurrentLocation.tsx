/* eslint-disable */
const watchCurrentLocation = (
  onUpdate: (location: { latitude: number; longitude: number }) => void,
  onError?: (error: any) => void
): number => {
  if (navigator.geolocation) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const id = navigator.geolocation.watchPosition(
      (position: any) => {
        onUpdate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log(
          "위치 갱신!",
          position.coords.latitude,
          position.coords.longitude
        );
      },
      onError || (() => {}),
      options
    );
    return id; // 반환값을 watchPosition 함수의 반환값으로 설정
  } else {
    onError && onError("Geolocation이 지원되지 않습니다.");
    return 0; // 실패 시 0을 반환하도록 설정
  }
};

export default watchCurrentLocation;
