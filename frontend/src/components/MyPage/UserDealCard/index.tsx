import React, { useState } from "react";
import "./index.scss";
import {
  BellIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/solid";
import Modal from "@components/common/Modal";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import {
  isDeleteCardModal,
  isAuctionAlarmModal,
  isdealDelete,
} from "../../../recoils/mypageModal/Atoms";

interface IProps {
  getmy?: string;
  deal: {
    dealId: number;
    dealTypeName: string;
    imageUrl: string;
    title: string;
    startTime: string;
    endTime: string;
    limitation: number;
    price: number;
    isBookmarked: boolean;
    meetingLocation: string;
  };
}

export default function index({ getmy, deal }: IProps) {
  const [modalOpen, setModalOpen] = useRecoilState(isDeleteCardModal);
  const modalClickHandler = () => {
    setModalOpen(true);
    setDealId(deal.dealId);
  };

  const [success, setSuccess] = useRecoilState(isAuctionAlarmModal);
  const successClickHandler = () => {
    const api = 1;
    setSuccess(api);
    console.log(isAuctionAlarmModal);
    console.log(success);
  };

  const [dealId, setDealId] = useRecoilState(isdealDelete);

  // 시간
  const startTime = new Date(deal.startTime);
  startTime.setHours(startTime.getHours() - 9); // 9 hours is the time difference between UTC and KST
  const timeDiff = Math.floor(
    (startTime.getTime() - new Date().getTime()) / (1000 * 60)
  );
  const endTime = new Date(deal.endTime);
  endTime.setHours(endTime.getHours() - 9); // 9 hours is the time difference between UTC and KST

  const startHour = String(startTime.getUTCHours()).padStart(2, "0");
  const startMinute = String(startTime.getUTCMinutes()).padStart(2, "0");
  const endHour = String(endTime.getUTCHours()).padStart(2, "0");
  const endMinute = String(endTime.getUTCMinutes()).padStart(2, "0");

  // 연월일
  const year = String(startTime.getFullYear()).slice(-2);
  const month = String(startTime.getMonth() + 1).padStart(2, "0");
  const day = String(startTime.getDate()).padStart(2, "0");

  let dealType = "";
  switch (deal.dealTypeName) {
    case "Sharing":
      dealType = "나눔";

      break;
    case "Auction":
      dealType = "경매";

      break;
    case "HourAuction":
      dealType = "Hour 경매";

      break;
    case "Trade":
      dealType = "거래";

      break;
    default:
      break;
  }

  return (
    <div>
      <div className="user-deal-card-container">
        {getmy === "getmy" ? (
          <button
            type="button"
            className="user-deal-card-delete"
            onClick={modalClickHandler}
          >
            <MinusCircleIcon />
          </button>
        ) : null}
        <Link to="/main" onClick={successClickHandler}>
          <div className="user-deal-card-wrapper-img">
            <img src={deal.imageUrl} alt="아이유" className="deal-img" />
            <p className="deal-tag">{dealType}</p>
          </div>
          <div className="user-deal-card-wrapper-containers">
            <p className="user-deal-card-title">{deal.title}</p>

            <div className="user-deal-card-wrapper">
              <BellIcon />
              <p className="user-deal-card-container-p">{`오픈 ${timeDiff}분 전`}</p>
            </div>
            <div className="user-deal-card-wrapper">
              <CalendarIcon />
              <p className="user-deal-card-container-p">
                {`${year}.${month}.${day}`}
              </p>
            </div>
            <div className="user-deal-card-wrapper">
              <ClockIcon />
              <p className="user-deal-card-container-p">{`${startHour}:${startMinute} ~ ${endHour}:${endMinute}`}</p>
            </div>
            <div className="user-deal-card-wrapper">
              <MapPinIcon />
              <p className="user-deal-card-container-p">
                {deal.meetingLocation}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
