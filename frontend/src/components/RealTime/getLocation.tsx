export const getLocation = () => {
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