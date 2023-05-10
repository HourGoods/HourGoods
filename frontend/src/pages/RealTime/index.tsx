import React, { useState, useEffect } from "react";
import getCurrentLocation from "@utils/getCurrentLocation";
import Map from "@components/RealTime/Map/index";
import CardList from "@components/RealTime/CardList";
import { concertAPI } from "@api/apis";
import { ConcertInterface } from "@pages/Search";
import "./index.scss";

/**
 * 콘서트와 딜 정보
 * @param location 사용자의 현재 위치
 * @param flag 최초 로딩인지 여부를 판별하는 flag
 * @param todayConcertList 당일 진행하는 콘서트 전체! 리스트
 * @param inConcertList 500m이내에 있는 콘서트 정보
 * @param concertDealList 500m 이내에 있는 콘서트별 딜 정보
 */

export default function index() {
  const [location, setLocation] = useState<
    { latitude: number; longitude: number } | string
  >("");
  const [flag, setFlag] = useState(false);
  const [todayConcertList, setTodayConcertList] = useState([]);
  const [inConcertList, setInConcertList] = useState<ConcertInterface[]>([]);
  const [concertDealList, setConcertDealList] = useState([]);

  // 최초의 현재 위치와 당일 콘서트 정보들만 불러옴
  useEffect(() => {
    getCurrentLocation()
      .then((response) => {
        if (typeof response === "string") {
          setLocation(response);
        } else {
          // api요청
          setLocation(response);
          concertAPI
            .getTodayConcert(response.latitude, response.longitude)
            .then((res) => {
              console.log(res, "api요청");
              setTodayConcertList(res.data.result.concertInfoList);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="realtime-page-container">
      <Map
        location={location}
        flag={flag}
        setFlag={setFlag}
        todayConcertList={todayConcertList}
        inConcertList={inConcertList}
        setInConcertList={setInConcertList}
      />

      <CardList
        inConcertList={inConcertList}
        concertDealList={concertDealList}
        setConcertDealList={setConcertDealList}
      />
    </div>
  );
}
