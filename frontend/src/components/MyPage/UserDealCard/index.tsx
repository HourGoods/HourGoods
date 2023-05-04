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
} from "../../../recoils/mypageModal/Atoms";

interface IProps {
  getmy?: string;
}

export default function index({ getmy }: IProps) {
  const [modalOpen, setModalOpen] = useRecoilState(isDeleteCardModal);
  const modalClickHandler = () => {
    setModalOpen(true);
    console.log(isDeleteCardModal);
  };

  const [success, setSuccess] = useRecoilState(isAuctionAlarmModal);
  const successClickHandler = () => {
    const api = 1;
    setSuccess(api);
    console.log(isAuctionAlarmModal);
    console.log(success);
  };

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
            <img
              src="https://openimage.interpark.com/goods_image_big/1/3/6/7/10657921367_l.jpg"
              alt="아이유"
              className="deal-img"
            />
            <p className="deal-tag">경매</p>
          </div>
          <div className="user-deal-card-wrapper-containers">
            <p className="user-deal-card-title">분홍드레스 아이유 포토카드</p>
            <div className="user-deal-card-wrapper">
              <BellIcon />
              <p className="user-deal-card-container-p">오픈 40분 전</p>
            </div>
            <div className="user-deal-card-wrapper">
              <CalendarIcon />
              <p className="user-deal-card-container-p">23.04.18</p>
            </div>
            <div className="user-deal-card-wrapper">
              <ClockIcon />
              <p className="user-deal-card-container-p">17:00 ~ 18:00</p>
            </div>
            <div className="user-deal-card-wrapper">
              <MapPinIcon />
              <p className="user-deal-card-container-p">
                종합운동장역 8번 출구
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
