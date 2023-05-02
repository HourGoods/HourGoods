import React from "react";
import { useNavigate } from "react-router";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { ConcertInterface } from "@pages/Search";
import "./index.scss";

interface ConcertCardProps {
  concertInfo: ConcertInterface;
}

export default function index({ concertInfo }: ConcertCardProps) {
  const navigate = useNavigate();
  const goDetail = () => {
    console.log("api 연결 후 주소 수정");
    navigate("/concertname");
  };
  return (
    <button
      type="button"
      className="concert-card-component-container"
      onClick={goDetail}
    >
      <div className="concert-card-left-img-wrapper">
        <img src={concertInfo.imageUrl} alt="" />
      </div>
      <div className="concert-card-right-contents-container">
        <p className="concert-title-p">{concertInfo.title}</p>
        <div className="card-icon-text-div">
          <CalendarIcon />
          <p>{concertInfo.startDate}</p>
        </div>
        <div className="card-icon-text-div">
          <MapPinIcon />
          <p>{concertInfo.place}</p>
        </div>
      </div>
    </button>
  );
}
