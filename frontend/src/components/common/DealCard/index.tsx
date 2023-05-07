import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { dealAPI } from "@api/apis";
import { DealInfoInterface } from "@pages/ConcertDeal";
import {
  MapPinIcon,
  CalendarIcon,
  BellIcon,
  BellAlertIcon,
  ClockIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/solid";
import BellAlertLineIcon from "@heroicons/react/24/outline/BellAlertIcon";
import Button from "@components/common/Button";
import "./index.scss";

interface DealCardProps {
  dealInfo: DealInfoInterface;
}

export default function index({ dealInfo }: DealCardProps) {
  // 들어오는 값에 따라 변하는 내용
  const [dealCardTimeInfo, setDealCardTimeInfo] = useState({
    startDate: "",
    timeInfo: "",
  });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const goDetail = () => {
    console.log("ㄱㄱ");
    navigate(`/deal/detail/${dealInfo.dealId}`);
  };

  useEffect(() => {
    // 북마크 정보
    setIsBookmarked(dealInfo.isBookmarked);
    // 시간정보
    const date = dealInfo.startTime.split("T")[0];
    const hour = dealInfo.startTime.split("T")[1];

    if (
      dealInfo.dealTypeName === "Trade" ||
      dealInfo.dealTypeName === "Sharing"
    ) {
      setDealCardTimeInfo({
        startDate: date,
        timeInfo: hour,
      });
    }
    // Auction일 경우 경매지속시간 계산
    if (dealInfo.endTime) {
      const end = dealInfo.endTime.split("T")[1];
      setDealCardTimeInfo({
        startDate: date,
        timeInfo: `${hour}~${end}`,
      });
    }
  }, []);

  // bookmark API
  const bookmarkHanlder = () => {
    // Bookmark가 없다면 -> 등록 api
    if (!isBookmarked) {
      const result = dealAPI.postBookmark(dealInfo.dealId);
      result.then((res) => {
        console.log(res, "북마크 성공 ㅋㅋ");
        setIsBookmarked(true);
      });
    }
    // 아니면 제거 api
    else {
      const result = dealAPI.deleteBookmark(dealInfo.dealId);
      result.then((res) => {
        console.log(res, "북마크 해제 ㅋㅋ");
        setIsBookmarked(false);
      });
    }
  };

  return (
    <div className="deal-card-component-container">
      <button
        className="deal-card-left-contents-container"
        type="button"
        onClick={goDetail}
      >
        <div className="deal-card-left-img-wrapper">
          <img src={dealInfo.imageUrl} alt="물품사진" />
        </div>
        <div className="deal-card-right-contents-container">
          <div className="deal-card-top-container">
            <p className="deal-title-p">{dealInfo.title}</p>
          </div>
          <div className="deal-card-bottom-container">
            <div className="card-icon-text-div">
              <CalendarIcon />
              <p>{dealCardTimeInfo.startDate}</p>
            </div>
            <div className="card-icon-text-div">
              <ClockIcon />
              <p>{dealCardTimeInfo.timeInfo}</p>
            </div>
            <div className="card-icon-text-div">
              <MapPinIcon />
              <p>{dealInfo.meetingLocation}</p>
            </div>
          </div>
        </div>
      </button>

      <div className="deal-card-alert-wrapper">
        <Button color={dealInfo.dealTypeName} size="deal" isActive />
        <button
          type="button"
          onClick={bookmarkHanlder}
          className="bookmark-button"
        >
          {isBookmarked ? <BellAlertIcon /> : <BellAlertLineIcon />}
        </button>
      </div>
    </div>
  );
}
