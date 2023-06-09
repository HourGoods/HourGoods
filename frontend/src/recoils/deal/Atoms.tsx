/* eslint-disable react/react-in-jsx-scope */
import { atom } from "recoil";

// 거래 생성 정보
const dealState = atom({
  key: "dealState",
  default: {
    imageUrl: "",
    title: "",
    content: "",
    startTime: "",
    longitude: 0,
    latitude: 0,
    meetingLocation: "",
    concertId: 0,
    // dealtypes: Auction, Sharing, Trade
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
