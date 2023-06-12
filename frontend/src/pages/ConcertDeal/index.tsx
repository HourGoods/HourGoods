/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import { concertAPI } from "@api/apis";
import { UserStateAtom } from "@recoils/user/Atom";
import SearchTab from "@components/ConcertDeal/SearchTab";
import DealCardList from "@components/ConcertDeal/DealCardList";
import ConcertCard from "@components/common/ConcertCard";
import Button from "@components/common/Button";
import { ConcertInterface } from "@interfaces/concert.interface";
import { DealInfoInterface } from "@interfaces/deal.interface";
import "./index.scss";

export type ConcertDealList = DealInfoInterface[];

export default function index() {
  const params = useParams();
  const stringConcertId = params.concertId;
  const [concertId, setConcertId] = useState(0);
  const [concertInfo, setConcertInfo] = useState<ConcertInterface>({
    imageUrl: "",
    kopisConcertId: "",
    place: "",
    startDate: "",
    title: "",
    concertId: 0,
    longitude: 0,
    latitude: 0,
  });
  const [concertDealList, setConcertDealList] = useState<ConcertDealList>([]);
  const userInfo = useRecoilValue(UserStateAtom);

  const navigate = useNavigate();
  const goMakeDeal = () => {
    navigate(`/create/deal/${concertId}`);
  };

  useEffect(() => {
    // 렌더링 시 먼저 콘서트 디테일 검색

    // 후 딜 검색 실행
    if (stringConcertId) {
      const { nickname } = userInfo;
      const concertId = parseInt(stringConcertId, 10);
      setConcertId(concertId);

      concertAPI
        .getConcertDetail(concertId)
        .then((res) => {
          const startDate = res.data.result.startTime;
          setConcertInfo({ ...res.data.result, startDate });
        })
        .then(() => {
          const result = concertAPI.getConcertDealList(
            concertId,
            -1,
            "All",
            "",
            nickname
          );
          result.then((res) => {
            setConcertDealList(res.data.result.dealInfoList);
          });
        });
    }
  }, []);

  return (
    <div className="concert-deal-page-container">
      <ConcertCard concertInfo={concertInfo} />
      <SearchTab
        concertId={concertId}
        nickname={userInfo.nickname}
        setConcertDealList={setConcertDealList}
      />
      <DealCardList concertDealList={concertDealList} />
      <div className="create-deal-button-wrapper">
        <Button color="dark-blue" onClick={goMakeDeal}>
          거래 생성하기
        </Button>
      </div>
    </div>
  );
}
