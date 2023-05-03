import React from "react";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { dealState, searchModalState } from "@recoils/deal/Atoms";
import { searchResultConcertState } from "@recoils/concert/Atoms";
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
  const [searchResultDealInfo, setSearchResultDealInfo] = useRecoilState(
    searchResultConcertState
  );

  const clickHanlder = () => {
    console.log(flag);
    console.log(concertInfo.kopisConcertId, "아이디");
    const { kopisConcertId } = concertInfo;
    // 콘서트 생성하기에서 만든 경우
    if (flag === "fromCreate") {
      // DB에서 콘서트 아이디 탐색
      const result = concertAPI.postConcertId(kopisConcertId);
      result
        .then((res) => {
          console.log(res);
          const { concertId } = res.data.result;
          // 콘서트 아이디 상태값 Update
          setDealInfo((prev) => ({
            ...prev,
            concertId,
          }));
          // 검색 결과에 표시될 내용 update
          setSearchResultDealInfo(concertInfo);
        })
        .catch((err) => {
          console.log(err);
        });
      // 처리가 끝나면 모달 닫기
      setModalOpen(false);

      // 전체 검색인 경우 클릭시 디테일 페이지로 이동
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
