import React, { useEffect } from "react";
import UploadImage from "@components/CreateDeal/UploadImage";
import DealInfo from "@components/CreateDeal/DealInfo";
import UploadDealLocation from "@components/CreateDeal/UploadDealLocation";
import Button from "@components/common/Button";
import { useRecoilState, useRecoilValue } from "recoil";
import { concertDetailState } from "@recoils/concert/Atoms";
import { dealState } from "@recoils/deal/Atoms";
import { concertAPI, dealAPI } from "@api/apis";
import "./index.scss";

export default function index() {
  const dealInfo = useRecoilValue(dealState);
  const [concertDetailInfo, setConcertDetailInfo] =
    useRecoilState(concertDetailState);

  useEffect(() => {
    console.log(dealInfo);
    // 최초 렌더링 시 최상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  // 검색 결과 콘서트가 있거나, 콘서트 아이디가 있는채로 넘어온 경우
  useEffect(() => {
    if (dealInfo.concertId) {
      // concert 상세 정보 조회 api
      const result = concertAPI.getConcertDetail(dealInfo.concertId);
      result.then((res) => {
        setConcertDetailInfo(res.data.result);
      });
    }
  }, [dealInfo.concertId]);

  const createDeal = () => {
    console.log(dealInfo);
    const result = dealAPI.postDeal(dealInfo);
    result.then((res) => {
      console.log(res);
    });
  };

  return (
    <div className="create-deal-page-container">
      <div className="create-deal-desktop-left-div">
        <DealInfo />
      </div>
      <div className="create-deal-desktop-right-div">
        <UploadImage />
        <UploadDealLocation />
      </div>
      <Button color="yellow" onClick={createDeal}>
        생성하기
      </Button>
    </div>
  );
}
