import React from "react";
import "./index.scss";
import {
  BellIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";

export default function index() {
  return (
    <div className="user-deal-card-container">
      <img alt="아이유" className="deal-img" />
      <div className="user-deal-card-wrapper">
        <span className="title">분홍드레스 아이유 포...</span>
        <div>
          <BellIcon />
          <span>
            오픈 <span>{40}</span>분 전
          </span>
        </div>
        <div>
          <CalendarIcon />
          <span>23.04.18</span>
        </div>
        <div>
          <ClockIcon />
          <span>17:00 ~ 18:00</span>
        </div>
        <div>
          <MapPinIcon />
          <span>종합운동장역 8번 출구</span>
        </div>
      </div>
    </div>
  );
}
