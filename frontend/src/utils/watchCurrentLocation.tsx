/* eslint-disable */
const watchCurrentLocation = (
  onUpdate: (location: { latitude: number; longitude: number }) => void,
  onError?: (error: any) => void
): void => {
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
  } else {
    onError && onError("Geolocation이 지원되지 않습니다.");
  }
};

export default watchCurrentLocation;
