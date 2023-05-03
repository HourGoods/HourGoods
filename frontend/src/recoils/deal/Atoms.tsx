import React from "react";
import { atom } from "recoil";

// 거래 생성 정보
const dealState = atom({
  key: "dealState",
  default: {
    imageUrl:
      "https://openimage.interpark.com/goods_image/6/9/4/6/9062906946s.jpg",
    title: "",
    content: "",
    startTime: "",
    longitude: 0,
    latitude: 0,
    memberId: 0,
    concertId: 0,
    // dealtypes: Auction, HourAuction, Sharing, Trade
    dealType: "Trade",
    // 경매
    minimumPrice: 0,
    endTime: "",
    // 나눔
    limit: 0,
    // 거래
    price: 0,
  },
});

// 거래 검색 Modal 상태
const searchModalState = atom({
  key: "searchModalState",
  default: false,
});

export { dealState, searchModalState };
