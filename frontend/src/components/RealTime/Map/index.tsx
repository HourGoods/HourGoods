import React, { useEffect, useState } from "react";
import getCurrentLocation from "@utils/getCurrentLocation";
import watchCurrentLocation from "@utils/watchCurrentLocation";
import ConcertCard from "@components/common/ConcertCard";
import {
  haversineDistance,
  isWithin500mFromLocation,
} from "@utils/isUserInConcertArea";
import { ConcertInterface } from "@pages/Search";
import { MapIcon } from "@heroicons/react/24/solid";
import markerImg from "@assets/userLocPoint.svg";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function index(props: any) {
  const { concertList, flag, setFlag, location, setLocation } = props;
  const [map, setMap] = useState<any>(null);
  const [CloseConcertInfo, setCloseConcertInfo] = useState<ConcertInterface[]>(
    []
  );

  // Props로 내려준 최초의 location
  useEffect(() => {
    const container = document.getElementById("map");
    // 지도 그리기
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 위치
      level: 4,
    };
    const map = new window.kakao.maps.Map(container, options);
    setMap(map);
    setFlag(true);

    // 콘서트 위치 그리기
    const concertLocations = concertList.map((concert: any) => {
      return {
        latitude: concert.latitude,
        longitude: concert.longitude,
      };
    });
    const promiseList = concertLocations.map((concertLoc: any) => {
      return isWithin500mFromLocation(
        concertLoc.latitude,
        concertLoc.longitude,
        location.latitude,
        location.longitude,
        map
      );
    });
    Promise.all(promiseList).then(() => {
      // 현재 위치 기준으로 지도 중심 이동
      map.setCenter(
        new window.kakao.maps.LatLng(location.latitude, location.longitude)
      );

      // 가까운 콘서트들은 저장
      // 가장 가까운 3개의 콘서트 정보만 저장
      const newInfos: ConcertInterface[] = concertList
        .slice(0, -1)
        .map((concert: any) => ({
          imageUrl: concert.imageUrl,
          kopisConcertId: concert.kopisConcertId,
          place: concert.place,
          startDate: concert.startime,
          title: concert.title,
          concertId: concert.concertId,
          longitude: concert.longitude,
          latitude: concert.latitude,
        }));
      setCloseConcertInfo(newInfos);
    });
  }, [location, concertList]);

  useEffect(() => {
    // 지속해서 현재 위치 감시하면서 marker그리기
    let watcher: number | undefined;

    if (flag && map) {
      watcher = watchCurrentLocation(map, (result: any) => {
        if (typeof result === "string") {
          // 에러 처리
          console.log(result);
          return;
        }
        // setLocation(result);

        // 가장 가까운 콘서트3개까지 범위 포함 여부 확인
        CloseConcertInfo.map((closeConcert: any) => {
          const drawingFlag = 1;
          isWithin500mFromLocation(
            closeConcert.latitude,
            closeConcert.longitude,
            result.latitude,
            result.longitude,
            map,
            drawingFlag
          );
          // const distance = haversineDistance(
          //   closeConcert.latitude,
          //   closeConcert.longitude,
          //   result.latitude,
          //   result.longitude
          // );
          // if (distance <= 500) {
          //   console.log(closeConcert.title, "가깝당 ㅎㅎ");
          //   // 가까우면 map에 색칠 다시해
          //   const drawingFlag = 1;
          //   isWithin500mFromLocation(
          //     closeConcert.latitude,
          //     closeConcert.longitude,
          //     result.latitude,
          //     result.longitude,
          //     map,
          //     drawingFlag
          //   );
          // }
          return map;
        });
        // 지도 중심 이동, 현재 위치 표시
        map.setCenter(
          new window.kakao.maps.LatLng(result.latitude, result.longitude)
        );
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
      <div className="realtime-page-title-div">
        <MapIcon />
        <p className="realtime-page-component-title-p">내 근처 Time Deal</p>
      </div>
      <p className="realtime-page-helper-p">
        오늘 Deal이 진행되는 콘서트를 확인해 보세요!
      </p>
      <div id="map" />
      {CloseConcertInfo[0] && <ConcertCard concertInfo={CloseConcertInfo[0]} />}
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
