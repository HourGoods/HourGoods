import React from "react";
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
