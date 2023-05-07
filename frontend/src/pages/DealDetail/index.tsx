import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { AuthStateAtom } from "@recoils/user/Atom";
import DealBanner from "@components/DealDetail/DealBanner";
import DealInfo from "@components/DealDetail/DealInfo";
import DealEnterButton from "@components/DealDetail/DealEnterButton";
import ConcertCard from "@components/common/ConcertCard";
import { ConcertInterface } from "@pages/Search";
import { concertAPI, dealAPI } from "@api/apis";
import "./index.scss";

export default function DealDetail() {
  const [dealInfo, setDealInfo] = useState({
    dealTitle: "",
    dealImageUrl: "",
    dealContent: "",
    dealLongitude: 0,
    dealLatitude: 0,
    dealType: "",
    userImageUrl: "",
    userNickname: "",
    startTime: "",
    concertTitle: "",
    meetingLocation: "",
    isBookmarked: false,
    minPrice: 0,
    endTime: "",
    price: 0,
    limit: 0,
    concertId: 0,
  });
  const navigate = useNavigate();
  const params = useParams();
  const stringDealId = params.dealId;
  const [dealId, setDealId] = useState(0);
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

  const userAuthInfo = useRecoilValue(AuthStateAtom);

  useEffect(() => {
    // login한 유저만 볼 수 있습니다
    if (!userAuthInfo.token) {
      alert("로그인해주세요");
      navigate("/main");
    }
    if (stringDealId) {
      const dealId = parseInt(stringDealId, 10); // 문자열을 숫자로 변환
      const result = dealAPI.getDealDeatail(dealId);
      setDealId(dealId);
      result.then((res) => {
        // console.log(res, "만든 걸로 받아온 deal 정보");
        setDealInfo(res.data.result);
        // 표시할 concert정보도 받아오기
        const { concertId } = res.data.result;
        concertAPI.getConcertDetail(concertId).then((res) => {
          setConcertInfo(res.data.result);
          console.log(res);
        });
      });
    }
  }, []);

  return (
    <div className="deal-detail-page-container">
      <DealBanner dealInfo={dealInfo} />
      <hr />
      <DealInfo dealInfo={dealInfo} setDealInfo={setDealInfo} dealId={dealId} concertInfo={concertInfo}/>
      <DealEnterButton dealInfo={dealInfo} dealId={dealId} />
    </div>
  );
}