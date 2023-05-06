import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useRecoilValue } from "recoil";
import { concertAPI } from "@api/apis";
import { UserStateAtom } from "@recoils/user/Atom";
import SearchTab from "@components/ConcertDeal/SearchTab";
import DealCardList from "@components/ConcertDeal/DealCardList";
import ConcertCard from "@components/common/ConcertCard";
import Button from "@components/common/Button";
import SearchBar from "@components/common/SearchBar";
import DealCard from "@components/common/DealCard";
import "./index.scss";

export interface DealInfoInterface {
  dealId: number;
  dealTypeName: string;
  endTime?: string;
  imageUrl: string;
  isBookmarked: boolean;
  limitation?: number;
  meetingLocation: string;
  price?: number;
  startTime: string;
  title: string;
}

export type ConcertDealList = DealInfoInterface[];

export default function index() {
  const params = useParams();
  const stringConcertId = params.concertId;
  const [concertId, setConcertId] = useState(0);
  const [concertDealList, setConcertDealList] = useState<ConcertDealList>([]);
  const userInfo = useRecoilValue(UserStateAtom);

  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location.state);
  const {concertInfo} = location.state;

  const goMakeDeal = () => {
    navigate("/create/deal", {
      state: { concertId, concertInfo },
    });
  };

  useEffect(() => {
    // 렌더링 시 전체 검색 실행
    if (stringConcertId) {
      const { nickname } = userInfo;
      const concertId = parseInt(stringConcertId, 10);
      setConcertId(concertId);

      const result = concertAPI.getConcertDealList(
        concertId,
        -1,
        "All",
        "",
        nickname
      );
      result.then((res) => {
        console.log("콘서트별 딜 정보", res);
        setConcertDealList(res.data.result.dealInfoList);
      });
    }
  }, []);

  return (
    <div className="concert-deal-page-container">
      <ConcertCard concertInfo={concertInfo} />
      <SearchTab />
      <DealCardList concertDealList={concertDealList} />
      <div className="create-deal-button-wrapper">
        <Button color="dark-blue" onClick={goMakeDeal}>
          거래 생성하기
        </Button>
      </div>
    </div>
  );
}
