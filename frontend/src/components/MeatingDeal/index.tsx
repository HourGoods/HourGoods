import React, { useEffect, useState } from "react";
import { dealAPI, meetingDealAPI } from "@api/apis";
import { useRecoilValue } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";
import { useLocation } from "react-router-dom";
import MeetingSocket from "./MeetingSocket";

export default function index() {
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname; // 내이름
  const location = useLocation();
  const chattingRoomId = location.state.chatRoomId;
  const [tradeLocationId, setTradeLocationId] = useState("");

  useEffect(() => {
    const req = meetingDealAPI.postlocationInfo(chattingRoomId);
    req.then((res) => {
      console.log(res.data.result.tradeLocationId); // 반환받은 tradeLocationId
      setTradeLocationId(res.data.result.tradeLocationId);
    });
  }, []);

  return (
    <div>
      <MeetingSocket tradeLocId={tradeLocationId} />
    </div>
  );
}
