import React, { useEffect, useState } from "react";
import getCurrentLocation from "@utils/getCurrentLocation";
import watchCurrentLocation from "@utils/watchCurrentLocation";
import ConcertCard from "@components/common/ConcertCard";
import { haversineDistance, drawCircles } from "@utils/realTime";
import { ConcertInterface } from "@pages/Search";
import { MapIcon } from "@heroicons/react/24/solid";
import markerImg from "@assets/userLocPoint.svg";
import { concertAPI } from "@api/apis";
import { useRecoilValue } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";

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
  flag: boolean;
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
  todayConcertList: any;
  inConcertList: any;
  setInConcertList: React.Dispatch<React.SetStateAction<any>>;
}

export default function index(props: mapProps) {
  const {
    location,
    setLocation,
    flag,
    setFlag,
    todayConcertList,
    inConcertList,
    setInConcertList,
  } = props;
  const [map, setMap] = useState<any>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const userInfo = useRecoilValue(UserStateAtom);

  // 최초 지도 그리기, 위치 변경
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 위치
      level: 4,
    };
    const map = new window.kakao.maps.Map(container, options);
    setMap(map);
    setFlag(true);

    // 오늘의 콘서트와 현재의 거리 받아오기
    todayConcertList.map((concert: any) => {
      const distance = haversineDistance(
        concert.latitude,
        concert.longitude,
        location.latitude,
        location.longitude
      );
      // 만약 500m안에 있는 게 있으면
      if (distance <= 460) {
        // 포함 여부 저장
        console.log(concert);
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
    // 콘서트장 위치 그렸으면 중심 이동
    setIsMapLoading(false);
    map.setCenter(
      new window.kakao.maps.LatLng(location.latitude, location.longitude)
    );
  }, [location, todayConcertList]);

  useEffect(() => {
    // 지속해서 현재 위치 감시하면서 marker그리기
    let watcher: number | undefined;

    if (map && flag) {
      watcher = watchCurrentLocation(map, (result: any) => {
        if (typeof result === "string") {
          // 에러 처리
          console.log(result, "watch");
          return;
        }
        console.log(result, "watch");
        // 오늘 concert영역 안에 있는지 확인
        todayConcertList.map((concert: any) => {
          const distance = haversineDistance(
            concert.latitude,
            concert.longitude,
            result.latitude,
            result.longitude
          );
          if (distance <= 460) {
            console.log(inConcertList, concert);

            // 이미 안에 있다고 판별 된 거면 아무 것도 안 해야 함!
            const isInConcertList = inConcertList.find(
              (inConcert: any) => inConcert.concertId === concert.concertId
            );
            if (isInConcertList) {
              console.log("이미 등록되어 있으니 아무 것도 하지 말자");
            } else {
              console.log("없었던 애니까 등록하자!");

              const newList = inConcertList.concat({
                ...concert,
                startDate: concert.startTime,
              });
              setInConcertList(newList);
              setIsMapLoading(true);
              alert("변화! 새로이 진입");
              setLocation(result);
              // window.location.reload();
            }
          } else if (distance > 460) {
            // 안에 있다고 등록되었던 애면 걔는 flag없애줘야 함!
            const isInConcertList = inConcertList.find(
              (inConcert: any) => inConcert.concertId === concert.concertId
            );
            if (isInConcertList) {
              console.log("등록되어 있던 애다. 없애자!");

              setInConcertList((prev: any) =>
                prev.filter(
                  (inConcert: any) => inConcert.concertId !== concert.concertId
                )
              );
              setIsMapLoading(true);
              alert("변화! 밖으로 나감");
              setLocation(result);

              // window.location.reload();
            } else {
              console.log("없던 애구나. 계속 없어라!");
            }
          }
          return null;
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
      {isMapLoading && <p>Map Loading...</p>}
      <div id="map" />
      <button type="button">내 위치 불러오기</button>
      {inConcertList[0] && <ConcertCard concertInfo={inConcertList[0]} />}
    </div>
  );
}
