import React, { useEffect, useState } from "react";
import { CalendarIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { IDealInfo } from "@components/Auction/AuctionBox";

interface IDealInfoProps {
  dealInfo: IDealInfo;
}

export default function AuctionDealCard({ dealInfo }: IDealInfoProps) {
  const [remainingTime, setRemainingTime] = useState("");
  const [progressBarWidth, setProgressBarWidth] = useState("0%");

  const updateRemainingTime = () => {
    const now = new Date();
    const endTime = new Date(dealInfo.endTime);
    const durationInMs = endTime.getTime() - now.getTime();
    if (durationInMs < 0) {
      setRemainingTime("경매 종료");
      setProgressBarWidth("100%");
      return;
    }
    const duration = new Date(durationInMs);
    const days = duration.getUTCDate() - 1;
    const hours = duration.getUTCHours();
    const minutes = duration.getUTCMinutes();
    const seconds = duration.getUTCSeconds();
    const timeString = `${days}일 ${hours}:${minutes}:${seconds}`;
    setRemainingTime(timeString);

    const startTime = new Date(dealInfo.startTime);
    const totalDuration = endTime.getTime() - startTime.getTime();
    // const passedTime = now.getTime() - startTime.getTime();
    const leftTime = endTime.getTime() - now.getTime();
    const progress = (leftTime / totalDuration) * 100;
    setProgressBarWidth(`${progress}%`);
  };

  useEffect(() => {
    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="auction-dealcard-container">
      <div className="a-dealcard-img">
        <img src={dealInfo.dealImageUrl} alt="" />
      </div>
      <div className="a-dealcard-right">
        <div className="a-dealcard-title">
          <p>{dealInfo.dealTitle}</p>
        </div>
        <div className="a-dealcard-date-time">
          <div className="a-dealcard-icon">
            <CalendarIcon />
            <p>{dealInfo.startTime.substr(0, 10)}</p>
          </div>
          <div className="a-dealcard-icon">
            <ClockIcon />
            <p>{dealInfo.startTime.substr(11, 5)}</p>
          </div>
        </div>
        <div>
          <div className="a-dealcard-icon">
            <MapPinIcon />
            <p>{dealInfo.meetingLocation}</p>
          </div>
        </div>
        <div className="a-dealcard-progressbar">
          <span style={{ width: progressBarWidth }} />
          <p>{remainingTime}</p>
        </div>
      </div>
    </div>
  );
}

// <div className="a-dealcard-progressbar">
//   <span style={{ width: `${progressBarWidth}%` }} />
//   <p>{formatDuration(remainingTime)}</p>
// </div>
// $(".meter > span").each(function () {
//   $(this)
//     .data("origWidth", $(this).width())
//     .width(0)
//     .animate(
//       {
//         width: $(this).data("origWidth"),
//       },
//       1200
//     );
// });
