import {
  ArrowUpIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  FireIcon,
  PlayIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import React from "react";

interface BidInfoProps {
  currentBid: number;
  participantCount: number;
}

export default function index({ currentBid, participantCount }: BidInfoProps) {
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
              <p>₩ 500</p>
            </div>
            <div className="r-bid-card-icon user">
              <UserGroupIcon />
              <p>{participantCount}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bid-box-container">
        <div className="cost-box-wrapper">
          <p>₩ 15,500</p>
        </div>
      </div>
    </>
  );
}
