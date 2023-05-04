import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UploadImage from "@components/CreateDeal/UploadImage";
import DealInfo from "@components/CreateDeal/DealInfo";
import UploadDealLocation from "@components/CreateDeal/UploadDealLocation";
import Button from "@components/common/Button";
import { useRecoilState } from "recoil";
import { concertDetailState } from "@recoils/concert/Atoms";
import { dealState } from "@recoils/deal/Atoms";
import { concertAPI, dealAPI } from "@api/apis";
import uploadDealImage from "@utils/uploadDealImage";
import "./index.scss";

export default function index() {
  const navigate = useNavigate();
  // 이미지 업로드를 위한 값
  const [inputImage, setInputImage] = useState({
    file: null,
    filename: "",
  });
  const [dealInfo, setDealInfo] = useRecoilState(dealState);
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

  const createDeal = async () => {
    try {
      // 이미지 업로드하여 이미지 주소 받아오기
      const imageUrl = await uploadDealImage(
        inputImage.file,
        inputImage.filename
      );

      if (imageUrl) {
        console.log("받아온 이미지 주소", imageUrl);
        // POST API 요청
        const result = dealAPI.postDeal({ ...dealInfo, imageUrl });
        result.then((res) => {
          alert("거래가 생성되었습니다!");
          // 성공시 detail페이지로 이동
          console.log(res, "생성된 거래 정보");
          const { dealId } = res.data.result;
          navigate(`/deal/detail/${dealId}`);
        });
      }
    } catch (error) {
      console.log(error, "이미지 업로드 에러");
    }
  };

  return (
    <div className="create-deal-page-container">
      <div className="create-deal-desktop-left-div">
        <DealInfo />
      </div>
      <div className="create-deal-desktop-right-div">
        <UploadImage inputImage={inputImage} setInputImage={setInputImage} />
        <UploadDealLocation />
      </div>
      <Button color="yellow" onClick={createDeal}>
        생성하기
      </Button>
    </div>
  );
}
