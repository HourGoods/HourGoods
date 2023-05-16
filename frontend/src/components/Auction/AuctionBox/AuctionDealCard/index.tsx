import React, { useEffect, useState } from "react";
import { CalendarIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { IDealInfo } from "@components/Auction/AuctionBox";
import Modal from "@components/common/Modal";
import Button from "@components/common/Button";
import { useNavigate } from "react-router-dom";

interface IDealInfoProps {
  dealInfo: IDealInfo;
}

export default function AuctionDealCard({ dealInfo }: IDealInfoProps) {
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState("");
  const [progressBarWidth, setProgressBarWidth] = useState("0%");
  const [modalOpen, setModalOpen] = useState(false);

  const updateRemainingTime = () => {
    const now = new Date();
    const endTime = new Date(dealInfo.endTime);
    const durationInMs = endTime.getTime() - now.getTime();
    if (durationInMs < 0) {
      setRemainingTime("경매 종료");
      setModalOpen(true);
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
        <img
          src={`https://d2uxndkqa5kutx.cloudfront.net/${dealInfo.dealImageUrl}`}
          alt=""
        />
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
      {modalOpen && (
        <Modal setModalOpen={setModalOpen}>
          <h1>경매 종료</h1>
          <p>경매가 종료되었습니다.</p>
          <Button
            onClick={() => {
              navigate("/mypage");
            }}
          >
            마이페이지로 돌아가기
          </Button>
        </Modal>
      )}
    </div>
  );
}
