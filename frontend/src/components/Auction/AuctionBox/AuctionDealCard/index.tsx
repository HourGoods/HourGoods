import { CalendarIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import React from "react";

export default function 옥션경매카드() {
  return (
    <div className="auction-dealcard-container">
      <div className="a-dealcard-upper">
        <div className="a-dealcard-upper-left">
          <img
            src="https://blog.kakaocdn.net/dn/c2ohsA/btqYiDFxucM/wk96pIBqCL084eSx3KlOBK/img.jpg"
            alt=""
          />
        </div>
        <div className="a-dealcard-upper-right">
          <div>
            <p>아이유 포토카드 팔아요</p>
          </div>
          <div className="a-dealcard-date-time">
            <div className="a-dealcard-icon">
              <CalendarIcon />
              <p>23.04.18</p>
            </div>
            <div className="a-dealcard-icon">
              <ClockIcon />
              <p>18:00</p>
            </div>
          </div>
          <div>
            <div className="a-dealcard-icon">
              <MapPinIcon />
              <p>종합운동장역 8번 출구</p>
            </div>
          </div>
        </div>
      </div>
      <div className="a-dealcard-bottom">
        <p>08:48</p>
      </div>
    </div>
  );
}
