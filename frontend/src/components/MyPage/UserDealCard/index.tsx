import React, { useState } from "react";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const detailNavigate = () => {
    navigate(`/deal/detail/${deal.dealId}`, {
      state: deal.dealId,
    });
  };

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
  // startTime.setHours(startTime.getHours() - 9); // 9 hours is the time difference between UTC and KST
  const openTimeDiff = Math.floor(
    (startTime.getTime() - new Date().getTime()) / (1000 * 60)
  );

  const endTime = new Date(deal.endTime);
  // endTime.setHours(endTime.getHours() - 9); // 9 hours is the time difference between UTC and KST
  const closeTimeDiff = Math.floor(
    (endTime.getTime() - new Date().getTime()) / (1000 * 60)
  );

  const startHour = String(startTime.getHours()).padStart(2, "0");
  const startMinute = String(startTime.getMinutes()).padStart(2, "0");
  const endHour = String(endTime.getHours()).padStart(2, "0");
  const endMinute = String(endTime.getMinutes()).padStart(2, "0");

  // 연월일
  const year = String(startTime.getFullYear()).slice(-2);
  const month = String(startTime.getMonth() + 1).padStart(2, "0");
  const day = String(startTime.getDate()).padStart(2, "0");

  let dealType = "";
  let backgroundcolor = "";
  switch (deal.dealTypeName) {
    case "Sharing":
      dealType = "나눔";
      backgroundcolor = "#fef9c3";
      break;
    case "Auction":
      dealType = "경매";
      backgroundcolor = "#c7d2fe";
      break;
    case "HourAuction":
      dealType = "Hour 경매";
      backgroundcolor = "#ede9fe";
      break;
    case "Trade":
      dealType = "거래";
      backgroundcolor = "#fbcfe8";
      break;
    default:
      break;
  }
  let statusText;

  if (openTimeDiff > 0) {
    statusText = `오픈 ${openTimeDiff}분 전`;
  } else if (openTimeDiff <= 0 && closeTimeDiff > 0) {
    statusText = "진행중";
  } else {
    statusText = "종료";
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
        <button type="button" onClick={detailNavigate}>
          <div className="user-deal-card-wrapper-img">
            <img src={deal.imageUrl} alt="아이유" className="deal-img" />
            <p
              className="deal-tag"
              style={{ backgroundColor: backgroundcolor }}
            >
              {dealType}
            </p>
          </div>
          <div className="user-deal-card-wrapper-containers">
            <p className="user-deal-card-title">{deal.title}</p>

            <div className="user-deal-card-wrapper">
              <BellIcon />
              {/* {openTimeDiff <= 0 ? (
                <p className="user-deal-card-container-p">종료</p>
              ) : (
                <p className="user-deal-card-container-p">{`오픈 ${openTimeDiff}분 전`}</p>
              )} */}
              <p className="user-deal-card-container-p">{statusText}</p>
            </div>
            <div className="user-deal-card-wrapper">
              <CalendarIcon />
              <p className="user-deal-card-container-p">
                {`${year}.${month}.${day}`}
              </p>
            </div>
            <div className="user-deal-card-wrapper">
              <ClockIcon />
              {deal.dealTypeName !== "Auction" &&
              deal.dealTypeName !== "HourAuction" ? (
                <p className="user-deal-card-container-p">{`${startHour}:${startMinute}`}</p>
              ) : (
                <p className="user-deal-card-container-p">{`${startHour}:${startMinute} ~ ${endHour}:${endMinute}`}</p>
              )}
            </div>
            <div className="user-deal-card-wrapper">
              <MapPinIcon />
              <p className="user-deal-card-container-p">
                {deal.meetingLocation}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
