import React from "react";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { dealState, searchModalState } from "@recoils/deal/Atoms";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { ConcertInterface } from "@pages/Search";
import { concertAPI } from "@api/apis";
import "./index.scss";

interface ConcertCardProps {
  concertInfo: ConcertInterface;
  flag?: string;
}

export default function index({ concertInfo, flag }: ConcertCardProps) {
  const navigate = useNavigate();

  // 검색 모달을 위한 값
  const [modalOpen, setModalOpen] = useRecoilState(searchModalState);

  // Update할 Deal 정보
  const [dealInfo, setDealInfo] = useRecoilState(dealState);

  const clickHanlder = () => {
    console.log(flag);
    console.log(concertInfo.kopisConcertId, "아이디");
    const { kopisConcertId } = concertInfo;
    if (flag === "fromCreate") {
      const result = concertAPI.postConcertId(kopisConcertId);
      result
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      // State Update
      console.log(concertInfo);
      setDealInfo((prev) => ({
        ...prev,
        // concertId: concertInfo.kopisConcertId,
      }));
      // setModalOpen(false);
      console.log(dealInfo);
    } else {
      console.log("api 연결 후 주소 수정");
      console.log(concertInfo);
      navigate("/concertname");
    }
  };
  return (
    <button
      type="button"
      className="concert-card-component-container"
      onClick={clickHanlder}
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
