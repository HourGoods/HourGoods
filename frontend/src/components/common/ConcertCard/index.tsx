import React from "react";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/solid";
import "./index.scss";

export default function index() {
  return (
    <div className="concert-card-component-container">
      <div className="concert-card-left-img-wrapper">
        <img
          src="https://cdnticket.melon.co.kr/resource/image/upload/product/2022/08/2022081115003052ef3ded-81f4-450b-8a60-3e0444da6d9f.jpg"
          alt=""
        />
      </div>
      <div className="concert-card-right-contents-container">
        <p className="concert-title-p">The Golden Hour : 오렌지 태양 아래</p>
        <div className="card-icon-text-div">
          <CalendarIcon />
          <p>23.04.18</p>
        </div>
        <div className="card-icon-text-div">
          <MapPinIcon />
          <p>종합운동장역 8번 출구</p>
        </div>
      </div>
    </div>
  );
}
