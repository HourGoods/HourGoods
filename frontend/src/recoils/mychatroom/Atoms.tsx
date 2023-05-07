import React from "react";
import { atom } from "recoil";

// {chatroomId} 를 가지고 있는 direct 채팅방의 모달 open/close\
// 추후 api 연결되면 해당 채팅방의 id값도 recoil에 담아서 넘겨줘야할 듯
export const isDMOpen = atom({
  key: "DMModal",
  default: false,
});
