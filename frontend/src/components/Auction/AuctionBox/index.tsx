import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuctionDealCard from "./AuctionDealCard";
import RealtimeBidCard from "./RealtimeBidCard";
import { BidMessage, InoutMessage } from "..";

export interface IDealInfo {
  concertId: number;
  concertTitle: string;
  dealContent: string;
  dealImageUrl: string;
  dealLatitude: number;
  dealLongitude: number;
  dealTitle: string;
  dealType: string;
  endTime: string;
  isBookmarked: boolean;
  limit: number | null;
  meetingLocation: string;
  minPrice: number;
  price: number | null;
  startTime: string;
  userImageUrl: string;
  userNickname: string;
}

interface Props {
  bidList: BidMessage[];
  inoutMsgList: InoutMessage[];
}

export default function index({ bidList, inoutMsgList }: Props) {
  // DealEnterButton 에서 state로 넘겨받은 정보
  const location = useLocation();
  const dealInfo = location.state.dealinfo; // DealCard에 들어갈 Deal 정보
  const nowBid = location.state.bidMoney; // 경매 시작가 혹은 입장하는 시점의 경매가
  const nowCount = location.state.pplCnt; // 입장시점의 경매참여자 수

  return (
    <div className="auctionbox-all-conatiner">
      <AuctionDealCard dealInfo={dealInfo} />
      <RealtimeBidCard
        bidList={bidList}
        nowBid={nowBid}
        nowCount={nowCount}
        inoutMsgList={inoutMsgList}
      />
    </div>
  );
}
