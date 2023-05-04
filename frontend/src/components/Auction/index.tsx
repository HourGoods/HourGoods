import React from "react";
import InputMsgBox from "@components/common/InputMsgBox";
import AuctionBox from "./AuctionBox";
import ChattingBox from "./ChattingBox";

export default function index() {
  return (
    <div className="auction-page-all-container">
      <AuctionBox />
      <ChattingBox />
      <div className="a-page-inputbox-container">
        <InputMsgBox type="bid" />
        <InputMsgBox type="msg" />
      </div>
    </div>
  );
}
