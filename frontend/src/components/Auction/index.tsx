import React from "react";
import InputMsgBox from "@components/common/InputMsgBox";
import AuctionBox from "./AuctionBox";
import ChattingBox from "./ChattingBox";

export default function index() {
  return (
    <div className="auction-page-all-container">
      <AuctionBox />
      <ChattingBox />
      <div>
        <InputMsgBox type="bid" />
        <InputMsgBox type="msg" />
      </div>
    </div>
  );
}
