/* eslint-disable react/no-array-index-key */
import { BidMessage } from "@components/Auction";
import {
  ArrowUpIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  FireIcon,
  PlayIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

interface BidInfoProps {
  bidList: BidMessage[];
}

export default function Index({ bidList }: BidInfoProps) {
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [interval, setInterval] = useState<number>(0);
  const [participantCount, setParticipantCount] = useState<number>(0);

  useEffect(() => {
    const latestBid = bidList[bidList.length - 1];
    if (latestBid) {
      setCurrentBid(latestBid.currentBid);
      setInterval(latestBid.interval);
      setParticipantCount(latestBid.participantCount);
    }
  }, [bidList]);

  // 23.05.09 12:36
  // 해야할 것
  // 1. 최초입장시 현재 입찰가와 참여자수 받아서 렌더링할 것
  // 2. atom에 사용자 포인트 넣어서 사용자포인트보다 큰 금액 응찰 못하게 막을 것
  // 3. 현재입찰가보다 낮은 금액은 응찰하지 못하도록 막을 것
  // 4. 웹소켓이 자꾸 튕김.. -> 소켓 입장할 때 토큰 확인하고 로그인 시키기
  // 5. 로그인 보완해서 refreshToken 넣어주는 로직짜기
  return (
    <>
      <div className="realtime-bid-card-container">
        <div className="realtime-bid-left">
          <p>현재 입찰가</p>
        </div>
        <div className="realtime-bid-right">
          <div className="r-bid-card-icon fire">
            <FireIcon />
            <p>{currentBid}</p>
          </div>
          <div className="r-const-ppl-wrapper">
            <div className="r-bid-card-icon up">
              <PlayIcon />
              <p>{interval}</p>
            </div>
            <div className="r-bid-card-icon user">
              <UserGroupIcon />
              <p>{participantCount}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bid-box-container">
        {bidList.map((bid: BidMessage, index: number) => (
          <div className="cost-box-wrapper" key={index}>
            <p>{bid.currentBid}</p>
          </div>
        ))}
      </div>
    </>
  );
}
