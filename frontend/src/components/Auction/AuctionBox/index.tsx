import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuctionDealCard from "./AuctionDealCard";
import RealtimeBidCard from "./RealtimeBidCard";

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

export default function index() {
  // DealEnterButton 에서 state로 넘겨받은 정보
  const location = useLocation();
  const dealInfo = location.state.dealinfo; // DealCard에 들어갈 Deal 정보
  const dealId = location.state.dealid; // 해당 delaId값
  const currentBid = location.state.bidMoney; // 경매 시작가 혹은 입장하는 시점의 경매가
  const participantCount = location.state.pplCnt; // 입장시점의 경매참여자 수

  // useEffect(() => {
  //   console.log(dealInfo);
  //   console.log(dealId);
  //   console.log(currentBid);
  //   console.log(participantCount);
  // });
  return (
    <div className="auctionbox-all-conatiner">
      <AuctionDealCard dealInfo={dealInfo} />
      <RealtimeBidCard />
    </div>
  );
}
