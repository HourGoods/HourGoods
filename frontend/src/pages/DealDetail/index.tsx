import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { AuthStateAtom } from "@recoils/user/Atom";
import DealBanner from "@components/DealDetail/DealBanner";
import DealInfo from "@components/DealDetail/DealInfo";
import DealEnterButton from "@components/DealDetail/DealEnterButton";
import AuctionResult from "@components/DealDetail/AuctionResult";
import { concertAPI, dealAPI } from "@api/apis";
import getCurrentLocation from "@utils/getCurrentLocation";
import { haversineDistance } from "@utils/isUserInConcertArea";
import { toast, ToastContainer } from "react-toastify";
import Modal from "@components/common/Modal";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";

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
  const [concertInfo, setConcertInfo] = useState({
    imageUrl: "",
    kopisConcertId: "",
    place: "",
    startDate: "",
    title: "",
    concertId: 0,
    longitude: 0,
    latitude: 0,
  });
  const [distance, setDistance] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const isLogin = localStorage.getItem("isLogin");

  useEffect(() => {
    // login한 유저만 볼 수 있습니다
    if (!isLogin) {
      toast.info("로그인 해주세요", {
        autoClose: 2000,
      });
      navigate("/");
    }
    if (stringDealId) {
      const dealId = parseInt(stringDealId, 10); // 문자열을 숫자로 변환
      const result = dealAPI.getDealDeatail(dealId);
      setDealId(dealId);
      result.then((res) => {
        // console.log(res, "만든 걸로 받아온 deal 정보");
        const deal = res.data.result;
        setDealInfo(deal);
        // 표시할 concert정보도 받아오기
        const { concertId } = res.data.result;
        concertAPI.getConcertDetail(concertId).then((res) => {
          setConcertInfo(res.data.result);
          console.log(res);

          // 종료된 경매면 isFinised 바꾸고 Modal에서 api
          const today = new Date();
          const endday = new Date(deal.endTime);

          if (endday && today > endday && deal.dealType === "Auction") {
            setIsFinished(true);
          }
        });
      });
    }
  }, []);

  // 현재 위치와 콘서트장 위치 대조
  useEffect(() => {
    if (concertInfo.latitude !== 0 && concertInfo.longitude !== 0) {
      let res: string | { latitude: number; longitude: number };
      getCurrentLocation().then((location) => {
        res = location;
        if (typeof res === "object" && res !== null) {
          const distance = haversineDistance(
            concertInfo.latitude,
            concertInfo.longitude,
            // 임시 현재 위치
            37.501,
            127.04
            // res.latitude,
            // res.longitude
          );

          setDistance(distance);
        }
      });
    }
  }, [concertInfo.latitude]);

  return (
    <>
      {isFinished && (
        <Modal setModalOpen={setIsFinished}>
          <AuctionResult
            isFinished={isFinished}
            dealId={dealId}
            creator={dealInfo.userNickname}
          />
        </Modal>
      )}
      <ToastContainer />
      <div className="deal-detail-page-container">
        <DealBanner dealInfo={dealInfo} />
        <hr />
        <DealInfo
          dealInfo={dealInfo}
          setDealInfo={setDealInfo}
          dealId={dealId}
          concertInfo={concertInfo}
          distance={distance}
        />
        {distance <= 1000 ? (
          <DealEnterButton dealInfo={dealInfo} dealId={dealId} />
        ) : (
          <div className="no-enter-button">
            <p>콘서트장에 도착하면 거래에 참여할 수 있어요 🤩</p>
          </div>
        )}
      </div>
    </>
  );
}
