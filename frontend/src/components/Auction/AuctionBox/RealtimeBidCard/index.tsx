/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/react-in-jsx-scope */
import { BidMessage, InoutMessage } from "@components/Auction";
import { FireIcon, PlayIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { AuctionCurrentBidAtom } from "@recoils/auction/Atoms";
import { scrollToBottom } from "@utils/scrollUtils";
import { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";

interface BidInfoProps {
  bidList: BidMessage[];
  nowBid: number;
  inoutMsgList: InoutMessage[];
}

export default function Index({ bidList, nowBid, inoutMsgList }: BidInfoProps) {
  const [currentBid, setCurrentBid] = useRecoilState(AuctionCurrentBidAtom);
  const [interval, setInterval] = useState<number>(0);
  const [participantCount, setParticipantCount] = useState<number>(0);
  const bidListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentBid(nowBid);
  }, [nowBid]);

  useEffect(() => {
    bidList.map((bid: BidMessage, index: number) => {
      setCurrentBid(bid.currentBid);
      setInterval(bid.interval);
      const costBoxElement = bidListRef.current?.children[index];
      costBoxElement?.classList.add("animate");
      setTimeout(() => {
        costBoxElement?.classList.remove("animate");
      }, 10000);
    });
    inoutMsgList.map((inout: InoutMessage) => {
      setParticipantCount(inout.participantCount);
    });
    scrollToBottom(bidListRef.current);
  }, [bidList, inoutMsgList]);

  const formatCurrency = (value: number): string => {
    return `${value.toLocaleString("ko-KR")} 원`;
  };

  return (
    <>
      <div className="realtime-bid-card-container">
        <div className="realtime-bid-left">
          <p>현재 입찰가</p>
          <div className="r-bid-card-icon-fire">
            <FireIcon />
            <p>{formatCurrency(currentBid)}</p>
          </div>
        </div>
        <div className="realtime-bid-right">
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
      <div className="bid-box-container-upper">
        <div className="bid-box-container">
          {bidList.map((bid: BidMessage, index: number) =>
            bid.currentBid ? (
              <div
                ref={bidListRef}
                className={`cost-box-wrapper ${
                  index % 2 === 0 ? "left" : "right"
                }`}
                key={index}
              >
                <p>{bid.currentBid}</p>
              </div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
}
