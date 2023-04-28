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

interface props {
  getmy?: string;
}

export default function index({ getmy }: props) {
  const [modalOpen, setModalOpen] = useState(false);
  const modalClickHandler = () => {
    setModalOpen(true);
  };

  return (
    <div className="user-deal-card-container">
      <div className="user-deal-card-wrapper-img">
        {getmy === "getmy" ? (
          <button
            type="button"
            className="user-deal-card-delete"
            onClick={modalClickHandler}
          >
            <MinusCircleIcon />
          </button>
        ) : null}
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
          <p className="user-deal-card-container-p">종합운동장역 8번 출구</p>
        </div>
      </div>
    </div>
  );
}
