import React, { useEffect, useState } from "react";
import getCurrentLocation from "@utils/getCurrentLocation";
import watchCurrentLocation from "@utils/watchCurrentLocation";
import ConcertCard from "@components/common/ConcertCard";
import isWithin500mFromLocation from "@utils/isUserInConcertArea";
import markerImg from "@assets/userLocPoint.svg";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function index(props: any) {
  const { concertList } = props;
  const [location, setLocation] = useState<
    { latitude: number; longitude: number } | string
  >("");
  const [flag, setFlag] = useState(false);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    const container = document.getElementById("map");

    // 지도 그리기
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 위치
      level: 4,
    };
    const map = new window.kakao.maps.Map(container, options);
    setMap(map);

    // 최초 렌더링시 현재 위치를 받아오고, 최초의 지도를 그림
    getCurrentLocation()
      .then((result) => {
        if (typeof result === "string") {
          setLocation(result);
        } else {
          setLocation(result);
          setFlag(true);

          // concertList 탐색
          // concertList.forEach((concert: any) => {
          //   isWithin500mFromLocation(
          //     concert.latitude,
          //     concert.longitude,
          //     result.latitude,
          //     result.longitude,
          //     map
          //   );
          // });

          // 현재 위치 기준으로 지도 중심 이동
          map.setCenter(
            new window.kakao.maps.LatLng(result.latitude, result.longitude)
          );
        }
      })
      .catch((err) => {
        console.log(err, "안되나");
      });
  }, []);

  useEffect(() => {
    // 지속해서 현재 위치 감시
    let watcher: number | undefined;
    if (flag && map) {
      watcher = watchCurrentLocation((result) => {
        if (typeof result === "string") {
          // 에러 처리
          console.log(result);
          return;
        }
        setLocation(result);
        // 지도 중심 이동, 현재 위치 표시
        map.setCenter(
          new window.kakao.maps.LatLng(result.latitude, result.longitude)
        );
        // marker 생성
        const markerImage = new window.kakao.maps.MarkerImage(
          markerImg, // 마커 이미지 URL
          new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
          {
            offset: new window.kakao.maps.Point(55, 55),
            alt: "현재 위치",
          }
        );

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            result.latitude,
            result.longitude
          ),
          image: markerImage,
        });
        marker.setMap(map);
      });
    }
    return () => {
      if (watcher) {
        navigator.geolocation.clearWatch(watcher);
      }
    };
  }, [flag, map]);

  return (
    <div className="realtime-map-component-container">
      <p className="realtime-page-component-title-p">내 근처 Time Deal</p>
      <div id="map" />
      {/* <ConcertCard /> */}
    </div>
  );
}

// useEffect(() => {
//   if (location && location !== "" && typeof location !== "string") {
//     // 현재 위치를 표시하는 마커 생성
//     const markerPosition = new window.kakao.maps.LatLng(
//       location.latitude,
//       location.longitude
//     );
//     console.log("현재위치", markerPosition, location.latitude);

//     const markerImage = new window.kakao.maps.MarkerImage(
//       markerImg, // 마커 이미지 URL
//       new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
//       {
//         offset: new window.kakao.maps.Point(55, 55),
//         alt: "현재 위치",
//       }
//     );

//     const marker = new window.kakao.maps.Marker({
//       position: markerPosition,
//       image: markerImage,
//     });
//     marker.setMap(Map);
//   }
// }, [location]);

// // 위치 확인용 좌표
// const sillaLocation = {
//   latitude: 37.504768995486,
//   longitude: 127.04144944792,
// };

// const sjrStation = {
//   latitude: 37.510257428761,
//   longitude: 127.04391561527,
// };

// const gangnamStation = {
//   latitude: 37.497,
//   longitude: 127.0254,
// };

// const nakseondaeStation = {
//   latitude: 37.476529777589,
//   longitude: 126.96428825991,
// };

// useEffect(() => {
//   if (location && location !== "" && typeof location !== "string") {
//     const container = document.getElementById("map");

//     // 현재 위치 기준으로 지도 생성
//     const options = {
//       center: new window.kakao.maps.LatLng(
//         location.latitude,
//         location.longitude
//       ),
//       level: 4,
//     };
//     const map = new window.kakao.maps.Map(container, options);

//     isWithin500mFromLocation(
//       sillaLocation.latitude,
//       sillaLocation.longitude,
//       location.latitude,
//       location.longitude,
//       map
//     );
//     isWithin500mFromLocation(
//       sjrStation.latitude,
//       sjrStation.longitude,
//       location.latitude,
//       location.longitude,
//       map
//     );
//     isWithin500mFromLocation(
//       gangnamStation.latitude,
//       gangnamStation.longitude,
//       location.latitude,
//       location.longitude,
//       map
//     );
//     // 낙성대역
//     isWithin500mFromLocation(
//       nakseondaeStation.latitude,
//       nakseondaeStation.longitude,
//       location.latitude,
//       location.longitude,
//       map
//     );
//   }
// }, []);
