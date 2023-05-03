import React from "react";
import { atom } from "recoil";

// 콘서트 검색 결과 활용할 카드 정보
const searchResultConcertState = atom({
  key: "searchResultConcertState",
  default: {
    imageUrl: "",
    kopisConcertId: "",
    place: "",
    startDate: "",
    title: "",
  },
});

// 콘서트 상세 정보
const concertDetailState = atom({
  key: "concertDetailState",
  default: {
    concertId: 0,
    title: "",
    imageUrl: "",
    longitude: 0,
    latitude: 0,
    place: "",
    startTime: "",
    kopisConcertId: "",
  },
});

export { searchResultConcertState, concertDetailState };
