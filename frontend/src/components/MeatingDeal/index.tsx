/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { meetingDealAPI } from "@api/apis";
import { useLocation } from "react-router-dom";
import MeetingSocket from "./MeetingSocket";

export default function index() {
  const location = useLocation();
  const chattingRoomId = location.state.chatRoomId;
  const [tradeLocationId, setTradeLocationId] = useState("");

  useEffect(() => {
    const req = meetingDealAPI.postlocationInfo(chattingRoomId);
    req.then((res) => {
      setTradeLocationId(res.data.result.tradeLocationId);
    });
  }, []);

  return (
    <div className="meeting-deal-component-container">
      <MeetingSocket tradeLocId={tradeLocationId} />
    </div>
  );
}
