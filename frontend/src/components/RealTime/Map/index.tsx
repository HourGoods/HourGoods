import React, { useEffect, useState, useRef } from "react";
import { watchCurrentLocation } from "@utils/locationUtils";
import ConcertCard from "@components/common/ConcertCard";
import { haversineDistance, drawCircles } from "@utils/locationUtils";
import { MapIcon } from "@heroicons/react/24/solid";
import focusing from "@assets/focusing.svg";
import markerImg from "@assets/userLocPoint.svg";

declare global {
  interface Window {
    kakao: any;
  }
}

/**
 * 콘서트와 딜 정보
 * @param location 사용자의 현재 위치
 * @param flag 최초 로딩인지 여부를 판별하는 flag
 * @param todayConcertList 당일 진행하는 콘서트 전체! 리스트
 * @param inConcertList 500m이내에 있는 콘서트 정보
 * @param concertDealList 500m 이내에 있는 콘서트별 딜 정보
 */

interface mapProps {
  location: any;
  setLocation: React.Dispatch<React.SetStateAction<any>>;
  // flag: boolean;
  // setFlag: React.Dispatch<React.SetStateAction<boolean>>;
  todayConcertList: any;
  inConcertList: any;
  setInConcertList: React.Dispatch<React.SetStateAction<any>>;
  isMapLoading: boolean;
  setIsMapLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function index(props: mapProps) {
  const {
    location,
    setLocation,
    // flag,
    // setFlag,
    todayConcertList,
    inConcertList,
    setInConcertList,
    isMapLoading,
    setIsMapLoading,
  } = props;
  const [map, setMap] = useState<any>(null);
  // flag
  const flagRef = useRef<boolean>(false);

  // 콘서트 범위
  const concertRange = 550;

  // 최초 지도 그리기, 위치 변경에 따른 지도 그리기
  useEffect(() => {
    setIsMapLoading(true);
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(37.49483466037, 127.02871475306), // 기본 위치
      level: 4,
    };
    const map = new window.kakao.maps.Map(container, options);
    setMap(map);

    // 오늘의 콘서트와 현재의 거리 받아오기
    // 오늘 콘서트 리스트 확인
    if (todayConcertList) {
      todayConcertList.map((concert: any) => {
        const distance = haversineDistance(
          concert.latitude,
          concert.longitude,
          location.latitude,
          location.longitude
          // 임시 현재 위치
          // 37.501,
          // 127.04
        );
        // 만약 500m안에 있는 게 있으면
        if (distance <= concertRange) {
          // 포함 여부 저장
          const newList = inConcertList.concat({
            ...concert,
            startDate: concert.startTime,
          });
          setInConcertList(newList);
        }
        // 콘서트장 그리기
        return drawCircles(
          distance,
          concert.latitude,
          concert.longitude,
          map,
          concert.concertId
        );
      });
    }
    // 콘서트장 위치 그렸으면 중심 이동
    setTimeout(() => setIsMapLoading(false), 1000);
    map.setCenter(
      // new window.kakao.maps.LatLng(37.501, 127.04)
      // 임시 현재 위치
      new window.kakao.maps.LatLng(location.latitude, location.longitude)
    );
    // 마운팅이 된 상태라는 뜻
    flagRef.current = true;
  }, [location, todayConcertList]);

  useEffect(() => {
    // 지속해서 현재 위치 감시하면서 marker그리기
    let watcher: number | undefined;

    // 지도가 마운팅이 된 것을 확인하고,
    if (map && flagRef.current) {
      watcher = watchCurrentLocation(map, (result: any) => {
        if (typeof result === "string") {
          // 에러 처리
          return;
        }
        // 오늘 concert영역 안에 있는지 확인
        todayConcertList.map((concert: any) => {
          const distance = haversineDistance(
            concert.latitude,
            concert.longitude,
            result.latitude,
            result.longitude
          );
          if (distance <= concertRange) {
            // 이미 안에 있다고 판별 된 거면 아무 것도 안 해야 함!
            const isInConcertList = inConcertList.find(
              (inConcert: any) => inConcert.concertId === concert.concertId
            );
            if (!isInConcertList) {
              const newList = inConcertList.concat({
                ...concert,
                startDate: concert.startTime,
              });
              setInConcertList(newList);
              setIsMapLoading(true);
              setLocation(result);
              // window.location.reload();
            }
          } else if (distance > concertRange) {
            // 안에 있다고 등록되었던 애면 걔는 flag없애줘야 함!
            const isInConcertList = inConcertList.find(
              (inConcert: any) => inConcert.concertId === concert.concertId
            );
            if (isInConcertList) {
              setInConcertList((prev: any) =>
                prev.filter(
                  (inConcert: any) => inConcert.concertId !== concert.concertId
                )
              );
              setIsMapLoading(true);
              setLocation(result);
              // window.location.reload();
            }
          }
          return null;
        });
        // 지도 중심 이동, 현재 위치 표시
        // map.setCenter(
        //   new window.kakao.maps.LatLng(result.latitude, result.longitude)
        // );
      });
    }
    return () => {
      if (watcher) {
        navigator.geolocation.clearWatch(watcher);
      }
    };
  }, [flagRef, map]);

  const moveFocus = () => {
    map.setCenter(
      // new window.kakao.maps.LatLng(37.501, 127.04)
      new window.kakao.maps.LatLng(location.latitude, location.longitude)
    );
  };

  return (
    <div className="realtime-map-component-container">
      <div className="realtime-page-title-div">
        <MapIcon />
        <p className="realtime-page-component-title-p">내 근처 Concert</p>
      </div>
      <p className="realtime-page-helper-p">
        오늘 Deal이 진행되는 콘서트를 확인해 보세요!
      </p>
      {isMapLoading && <p>Map Loading...</p>}
      <div className="map-button-div">
        <div id="map" />
        <button type="button" onClick={moveFocus}>
          <img src={focusing} alt="내위치로" />
        </button>
      </div>
      {inConcertList[0] && <ConcertCard concertInfo={inConcertList[0]} />}
    </div>
  );
}
