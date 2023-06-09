/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { CalendarIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { IDealInfo } from "@components/Auction/AuctionBox";
import Modal from "@components/common/Modal";
import Button from "@components/common/Button";
import { useNavigate } from "react-router-dom";

interface IDealInfoProps {
  dealInfo: IDealInfo;
  serverTime: string;
}

export default function AuctionDealCard({
  dealInfo,
  serverTime,
}: IDealInfoProps) {
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState("");
  const [progressBarWidth, setProgressBarWidth] = useState("0%");
  const [modalOpen, setModalOpen] = useState(false);
  const [timeDifference, setTimeDifference] = useState(0);

  const updateRemainingTime = () => {
    const now = new Date();
    const clientTime = new Date(now.getTime() + timeDifference);
    const endTime = new Date(dealInfo.endTime);
    const durationInMs = endTime.getTime() - clientTime.getTime();
    if (durationInMs < 0) {
      setRemainingTime("경매 종료");
      setModalOpen(true);
      setProgressBarWidth("100%");
      return;
    }
    const days = Math.floor(durationInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((durationInMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((durationInMs / (1000 * 60)) % 60);
    const seconds = Math.floor((durationInMs / 1000) % 60);
    const timeString = `${days}일 ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    setRemainingTime(timeString);

    const startTime = new Date(dealInfo.startTime);
    const totalDuration = endTime.getTime() - startTime.getTime();
    const leftTime = endTime.getTime() - clientTime.getTime();
    const progress = (leftTime / totalDuration) * 100;
    setProgressBarWidth(`${progress}%`);
  };

  useEffect(() => {
    const serverTimeDiff =
      new Date(serverTime).getTime() - new Date().getTime();
    setTimeDifference(serverTimeDiff);
  }, [serverTime]);

  useEffect(() => {
    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(intervalId);
  }, [timeDifference]);
  return (
    <div className="auction-dealcard-container">
      <div className="a-dealcard-img">
        {dealInfo.dealImageUrl && dealInfo.dealImageUrl !== "" ? (
          <img
            src={`https://d2uxndkqa5kutx.cloudfront.net/${dealInfo.dealImageUrl}`}
            alt=""
          />
        ) : null}
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
