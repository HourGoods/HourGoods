import React, { useEffect, useState } from "react";
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
        const result = await dealAPI.postDeal({ ...dealInfo, imageUrl });
        console.log(result);
      }
    } catch (error) {
      console.log(error);
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
