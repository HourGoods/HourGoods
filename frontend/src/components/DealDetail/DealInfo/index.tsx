import React, { useEffect, useState } from "react";
import { dealAPI } from "@api/apis";
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
import BellAlertLinIcon from "@heroicons/react/24/outline/BellAlertIcon";
import markerImg from "@assets/dealMarkerImg.svg";

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
  const { dealInfo, setDealInfo, dealId } = props;
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
      const start = new Date(dealInfo.startTime);
      const end = new Date(dealInfo.endTime);
      console.log(start, end);
      console.log((end.getTime() - start.getTime()) / 60000, "계산");
      // 분단위 ms로 나누기
      const duration = (end.getTime() - start.getTime()) / 60000;
      setAuctionDuration(duration);
      console.log(auctionDuration);
    }

    // map 그리기

    const container = document.getElementById("map");
    const mapOption = {
      center: new window.kakao.maps.LatLng(
        dealInfo.dealLatitude,
        dealInfo.dealLongitude
      ), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };
    console.log(mapOption);

    // 지도를 표시할 dv와  지도 옵션으로  지도를 생성합니다
    const map = new window.kakao.maps.Map(container, mapOption);
    // marker 표시
    // const markerImage = new window.kakao.maps.MarkerImage(
    //   markerImg, // 마커 이미지 URL
    //   new window.kakao.maps.Size(35, 35), // 마커 이미지 크기
    //   {
    //     // offset: new window.kakao.maps.Point(55, 55),
    //     alt: "거래 장소",
    //   }
    // );
    // 마커를 생성합니다
    const marker = new window.kakao.maps.Marker({
      position: mapOption.center,
      // image: markerImage,
    });
    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  }, [dealInfo]);

  // bookmark API
  const bookmarkHanlder = () => {
    // Bookmark가 없다면 -> 등록 api
    if (!dealInfo.isBookmarked) {
      const result = dealAPI.postBookmark(dealId);
      result.then((res) => {
        console.log(res, "북마크 성공 ㅋㅋ");
        setDealInfo((prev: any) => ({
          ...prev,
          isBookmarked: true,
        }));
      });
    }
    // 아니면 제거 api
    else {
      const result = dealAPI.deleteBookmark(dealId);
      result.then((res) => {
        console.log(res, "북마크 해제 ㅋㅋ");
        setDealInfo((prev: any) => ({
          ...prev,
          isBookmarked: false,
        }));
      });
    }
  };

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
              <button type="button" onClick={bookmarkHanlder}>
                {dealInfo.isBookmarked ? (
                  <BellAlertIcon />
                ) : (
                  <BellAlertLinIcon />
                )}
              </button>
            </div>

            {/* <ConcertCard /> */}

            <div className="deal-icon-infos-container">
              <div className="deal-icon-info-div">
                <div className="icon-text-div">
                  <CalendarIcon />
                  <h5>날짜</h5>
                </div>
                <p>{startDate}</p>
              </div>
              <div className="deal-icon-info-div">
                <div className="icon-text-div">
                  <ClockIcon />
                  <h5>오픈 시간</h5>
                </div>
                <p>{startTime}</p>
              </div>
              <div className="deal-icon-info-div">
                {dealInfo.dealType === "Auction" && (
                  <>
                    <div className="icon-text-div">
                      <BoltIcon />
                      <h5>경매 진행 시간</h5>
                    </div>
                    <p>{auctionDuration}분</p>
                  </>
                )}
                {dealInfo.dealType === "HourAuction" && (
                  <>
                    <div className="icon-text-div">
                      <BoltIcon />
                      <h5>경매 진행 시간</h5>
                    </div>
                    <p>{auctionDuration}분</p>
                  </>
                )}
                {dealInfo.dealType === "Trade" && (
                  <>
                    <div className="icon-text-div">
                      <TicketIcon />
                      <h5>거래 가격</h5>
                    </div>
                    <p>{dealInfo.price} 원</p>
                  </>
                )}{" "}
                {dealInfo.dealType === "Sharing" && (
                  <>
                    <div className="icon-text-div">
                      <UsersIcon />
                      <h5>나눔 인원</h5>
                    </div>
                    <p>{dealInfo.limit} 명</p>
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
              <p>{dealInfo.meetingLocation}</p>
            </div>
            <div id="map" />
          </div>
        </div>
      </div>
    );
  }
  return null;
}
