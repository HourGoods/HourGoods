import React, { useEffect } from "react";
import Button from "@components/common/Button";
import ConcertCard from "@components/common/ConcertCard";
import {
  ClockIcon,
  CalendarIcon,
  TicketIcon,
  UsersIcon,
  BoltIcon,
  MegaphoneIcon,
  MapPinIcon,
  BellAlertIcon,
} from "@heroicons/react/24/solid";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function index() {
  useEffect(() => {
    const container = document.getElementById("map");
    const mapOption = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    const map = new window.kakao.maps.Map(container, mapOption);
  }, []);

  return (
    <div className="deal-info-component-container">
      {/* 위 */}
      <div className="deal-info-desktop-top-container">
        <Button color="syellow" size="deal" isActive>
          나눔
        </Button>
      </div>

      {/* 아래 */}
      <div className="deal-info-desktop-bottom-container">
        {/* 좌 */}
        <div className="deal-info-desktop-left-container">
          <div className="title-alert-container">
            <h2>예쁜 아이유 포카 팔아용</h2>
            <BellAlertIcon />
          </div>

          <ConcertCard />

          <div className="deal-icon-infos-container">
            <div className="deal-icon-info-div">
              <CalendarIcon />
              <p>23.04.18</p>
            </div>
            <div className="deal-icon-info-div">
              <ClockIcon />
              <p>18:00</p>
            </div>
            <div className="deal-icon-info-div">
              <UsersIcon />
              <p>20명</p>
            </div>
          </div>

          <div className="deal-info-icon-p-div">
            <MegaphoneIcon />
            <p>공지사항</p>
          </div>
          <p>
            사람이 많이 모이는만큼 나눔을 신청하신 여러분 모두 늦지 않게
            종합운동장역 8번 출구 앞 분수대 앞으로 도착하시길 바랍니다.
          </p>
        </div>

        {/* 우 */}
        <div className="deal-info-desktop-right-container">
          <div className="deal-info-icon-p-div">
            <MapPinIcon />
            <p>종합운동장 8번 게이트 앞</p>
          </div>
          <div id="map" />
        </div>
      </div>
    </div>
  );
}
