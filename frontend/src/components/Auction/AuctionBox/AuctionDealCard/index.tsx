import { CalendarIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import React from "react";

export default function 옥션경매카드() {
  return (
    <div className="auction-dealcard-container">
      <div className="a-dealcard-img">
        <img
          src="https://blog.kakaocdn.net/dn/c2ohsA/btqYiDFxucM/wk96pIBqCL084eSx3KlOBK/img.jpg"
          alt=""
        />
      </div>
      <div className="a-dealcard-right">
        <div className="a-dealcard-title">
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
        <div className="a-dealcard-progressbar">
          <span style={{ width: "40%" }} />
          <p>08:48</p>
        </div>
      </div>
    </div>
  );
}

// $(".meter > span").each(function () {
//   $(this)
//     .data("origWidth", $(this).width())
//     .width(0)
//     .animate(
//       {
//         width: $(this).data("origWidth"),
//       },
//       1200
//     );
// });
