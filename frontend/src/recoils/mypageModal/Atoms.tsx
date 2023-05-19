/* eslint-disable react/react-in-jsx-scope */
import { atom } from "recoil";

// 거래카드 삭제할건지 여부 알려주는 모달창
export const isDeleteCardModal = atom({
  key: "isDeleteCardModal",
  default: false,
});

// 낙찰 실패 여부 알려주는 모달창
export const isAuctionAlarmModal = atom({
  key: "isAuctionAlarmModal",
  default: 0,
});

// 딜 카드 삭제 dealId
export const isdealDelete = atom({
  key: "isdealDelete",
  default: 0,
});
