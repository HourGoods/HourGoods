import React from "react";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { dealState, searchModalState } from "@recoils/deal/Atoms";
import { searchResultConcertState } from "@recoils/concert/Atoms";
import { MapPinIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/solid";
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
  const [searchResultConcertInfo, setSearchResultConcertInfo] = useRecoilState(
    searchResultConcertState
  );

  const clickHanlder = () => {
    const { kopisConcertId } = concertInfo;

    // DB에서 콘서트 아이디 탐색
    const result = concertAPI.postConcertId(kopisConcertId);
    result
      .then((res) => {
        console.log(res, "DB에서 받아온 ID값");
        const { concertId } = res.data.result;

        if (flag === "fromCreate") {
          // 딜 생성에서 만든 경우
          // 콘서트 아이디 상태값 Update
          setDealInfo((prev) => ({
            ...prev,
            concertId,
          }));
          concertAPI.getConcertDetail(concertId).then((res) => {
            console.log(res);
            const startDate = res.data.result.startTime;
            setSearchResultConcertInfo({ ...res.data.result, startDate });
          });
        } else {
          navigate(`/concert/${concertId}`, {
            state: { concertId, concertInfo },
          }); // 전체 검색인 경우 클릭시 디테일 페이지로 이동
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // 처리가 끝나면 모달 닫기
    setModalOpen(false);
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
          {concertInfo.startTime ? (
            <p>
              {concertInfo.startTime.slice(0, 10)} ||{" "}
              {concertInfo.startTime.slice(11, -3)}
            </p>
          ) : (
            <p>{concertInfo.startDate}</p>
          )}
        </div>
        <div className="card-icon-text-div">
          <MapPinIcon />
          <p>{concertInfo.place}</p>
        </div>
      </div>
    </button>
  );
}
