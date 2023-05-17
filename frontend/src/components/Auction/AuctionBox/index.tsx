/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuctionAPI } from "@api/apis";
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
  const [nowBid, setNowBid] = useState(location.state.bidMoney); // 경매 시작가 혹은 입장하는 시점의 경매가
  const [nowCount, setNowCount] = useState(location.state.pplCnt); // 입장시점의 경매참여자 수
  const [serverTime, setServerTime] = useState(""); // 입장시점의 경매참여자 수
  const dealId = location.state.dealid;
  const [isDealCardClick, setIsDealCardClik] = useState(true);

  useEffect(() => {
    const fetchCurrentBid = async () => {
      try {
        const response = await AuctionAPI.getableAuction(dealId);
        console.log(response.data.result);
        const currentBid = response.data.result.currentBid;
        const serverTime = response.data.result.currentTime;
        setNowBid(currentBid);
        setServerTime(serverTime);
      } catch (error) {
        console.error("Error fetching current bid:", error);
      }
    };
    fetchCurrentBid();
  }, [nowBid, dealId]);

  const dealCardClickHandler = () => {
    setIsDealCardClik(!isDealCardClick);
  };

  return (
    <div className="auctionbox-all-conatiner">
      {isDealCardClick ? (
        <button
          type="button"
          className="dealCard-toggle-button"
          onClick={dealCardClickHandler}
        >
          <p>▼ 거래 정보보기 ▼</p>
        </button>
      ) : (
        <button
          type="button"
          className="dealCard-toggle-button-active"
          onClick={dealCardClickHandler}
        >
          <AuctionDealCard dealInfo={dealInfo} serverTime={serverTime} />
        </button>
      )}
      <RealtimeBidCard
        bidList={bidList}
        nowBid={nowBid}
        nowCount={nowCount}
        inoutMsgList={inoutMsgList}
      />
    </div>
  );
}
