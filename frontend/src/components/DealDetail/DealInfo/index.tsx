import React, { useEffect, useState } from "react";
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

interface ButtonColor {
  [key: string]: string;
}
interface ButtonContent {
  [key: string]: string;
}

export default function index(props: any) {
  const { dealInfo } = props;
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [auctionDuration, setAuctionDuration] = useState(0);

  useEffect(() => {
    // DealInfo가 들어오면 작성되는 값 변경

    // 날짜 parsing
    setStartDate(dealInfo.startTime.split("T")[0]);
    setStartTime(dealInfo.startTime.substring(11, 16));

    // Auction일 경우 경매지속시간 계산
    if (
      dealInfo.dealType === "Auction" ||
      dealInfo.dealType === "HourAuction"
    ) {
      const duration = dealInfo.startTime - dealInfo.endTime;
      setAuctionDuration(duration);
    }

    // map 그리기

    const container = document.getElementById("deal-map");
    const mapOption = {
      center: new window.kakao.maps.LatLng(
        dealInfo.dealLatitude,
        dealInfo.dealLongitude
      ), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    // 지도를 표시할 dv와  지도 옵션으로  지도를 생성합니다
    const map = new window.kakao.maps.Map(container, mapOption);
  }, [dealInfo]);

  if (dealInfo) {
    return (
      <div className="deal-info-component-container">
        {/* 위 */}
        <div className="deal-info-desktop-top-container">
          <Button color={dealInfo.dealType} size="deal" isActive />
        </div>

        {/* 아래 */}
        <div className="deal-info-desktop-bottom-container">
          {/* 좌 */}
          <div className="deal-info-desktop-left-container">
            <div className="title-alert-container">
              <h2>{dealInfo.dealTitle}</h2>
              <BellAlertIcon />
            </div>

            {/* <ConcertCard /> */}

            <div className="deal-icon-infos-container">
              <div className="deal-icon-info-div">
                <CalendarIcon />
                <p>{startDate}</p>
              </div>
              <div className="deal-icon-info-div">
                <ClockIcon />
                <p>{startTime}</p>
              </div>
              <div className="deal-icon-info-div">
                {dealInfo.dealType === "Auction" ||
                  (dealInfo.dealType === "HourAuction" && (
                    <>
                      <BoltIcon />
                      <p>{auctionDuration}</p>
                    </>
                  ))}{" "}
                {dealInfo.dealType === "Trade" && (
                  <>
                    <TicketIcon />
                    <p>{dealInfo.price}</p>
                  </>
                )}{" "}
                {dealInfo.dealType === "Sharing" && (
                  <>
                    <UsersIcon />
                    <p>{dealInfo.limit}</p>
                  </>
                )}
              </div>
            </div>

            <div className="deal-info-icon-p-div">
              <MegaphoneIcon />
              <p>공지사항</p>
            </div>
            <p>{dealInfo.dealContent}</p>
          </div>

          {/* 우 */}
          <div className="deal-info-desktop-right-container">
            <div className="deal-info-icon-p-div">
              <MapPinIcon />
              <p>{dealInfo.startTime} 주소 어디있노!!! 어디있냐고!!</p>
            </div>
            <div id="deal-map" />
          </div>
        </div>
      </div>
    );
  }
  return null;
}
