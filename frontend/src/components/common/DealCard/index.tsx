import React from "react";
import {
  MapPinIcon,
  CalendarIcon,
  BellIcon,
  BellAlertIcon,
  ClockIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/solid";
import "./index.scss";

export default function index() {
  return (
    <div className="deal-card-component-container">
      <div className="deal-card-left-contents-container">
        <div className="deal-card-left-img-wrapper">
          <img
            src="https://openimage.interpark.com/goods_image_big/1/3/6/7/10657921367_l.jpg"
            alt=""
          />
        </div>
        <div className="deal-card-right-contents-container">
          <div className="deal-card-top-container">
            <p className="deal-title-p">콘서트 한정판 아이유 포토카드</p>
            <p>교환</p>
          </div>
          <div className="deal-card-bottom-container">
            <div className="card-icon-text-div">
              <CalendarIcon />
              <p>23.04.18</p>
            </div>
            <div className="card-icon-text-div">
              <ClockIcon />
              <p>17:00 ~ 18:00</p>
            </div>
            <div className="card-icon-text-div">
              <MapPinIcon />
              <p>종합운동장역 8번 출구</p>
            </div>
          </div>
        </div>
      </div>

      <div className="deal-card-alert-wrapper">
        <BellAlertIcon />
      </div>
    </div>
  );
}
