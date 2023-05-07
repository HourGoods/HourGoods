import React, { useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { mypageAPI } from "@api/apis";

export default function index() {
  useEffect(() => {
    mypageAPI
      .pointHistory(-1)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  });
  return (
    // <div>
    //   <div className="ticketcard-container">
    //     <div className="div-decoration">
    //       <div className="ticketcard-day-wrapper">
    //         <p className="ticketcard-day-p">2023.04.24 (오늘)</p>
    //       </div>
    //     </div>
    //     <div className="div-decoration">
    //       <div className="ticketcard-detail-wrapper">
    //         <p className="detail-title">분홍드레스 아이유 포토카드</p>
    //         <p className="cash">-5000원</p>
    //       </div>
    //     </div>
    //   </div>
    //   <ChevronDownIcon />
    // </div>
    <div className="ticketcard-container">
      <div className="div-decoration">
        <div className="ticketcard-day-wrapper">
          <p className="ticketcard-day-p">2023.04.24 (오늘)</p>
        </div>
        <div className="ticketcard-detail-wrapper">
          <p className="detail-title">분홍드레스 아이유 포토카드</p>
          <p className="cash">-5000원</p>
        </div>
      </div>
    </div>
  );
}