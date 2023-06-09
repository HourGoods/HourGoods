/* eslint-disable no-nested-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadImage from "@components/CreateDeal/UploadImage";
import DealInfo from "@components/CreateDeal/DealInfo";
import UploadDealLocation from "@components/CreateDeal/UploadDealLocation";
import Button from "@components/common/Button";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { dealState } from "@recoils/deal/Atoms";
import { dealAPI } from "@api/apis";
import uploadDealImage from "@utils/uploadDealImage";
import { toast, ToastContainer } from "react-toastify";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";
import { UserStateAtom } from "@recoils/user/Atom";

export default function index() {
  const navigate = useNavigate();
  // 이미지 업로드를 위한 값
  const [inputImage, setInputImage] = useState({
    file: null,
    filename: "",
  });
  // 닉네임
  const { nickname } = useRecoilValue(UserStateAtom);
  const dealInfo = useRecoilValue(dealState);
  const resetDealInfo = useResetRecoilState(dealState);

  useEffect(() => {
    // 최초 렌더링 시 최상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  const createDeal = async () => {
    // 로딩 추가하기
    try {
      // 이미지 업로드하여 이미지 주소 받아오기
      const imageUrl = await uploadDealImage(
        inputImage.file,
        inputImage.filename,
        nickname
      );

      if (imageUrl) {
        // 작성 똑바로했는지 검증
        if (
          !dealInfo.title ||
          !dealInfo.concertId ||
          !dealInfo.startTime ||
          !dealInfo.meetingLocation ||
          !dealInfo.dealType ||
          !dealInfo.meetingLocation
        ) {
          toast.error("내용을 모두 입력해 주세요", {
            autoClose: 2000,
          });
        } else {
          // POST API 요청
          const baseUrl =
            "https://a204-hourgoods-bucket.s3.ap-northeast-2.amazonaws.com/";
          const trimmedUrl = imageUrl.substring(baseUrl.length);
          const result = dealAPI.postDeal({
            ...dealInfo,
            imageUrl: trimmedUrl,
          });
          result.then((res) => {
            toast.success("거래가 생성되었습니다!", {
              autoClose: 2000,
            });
            // 성공시 detail페이지로 이동
            // recoil 비우기
            resetDealInfo();
            const { dealId } = res.data.result;
            navigate(`/deal/detail/${dealId}`);
          });
        }
      }
    } catch (error) {
      console.error(error, "이미지 업로드 에러");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="create-deal-page-container">
        <div className="create-deal-desktop-left-div">
          <DealInfo />
        </div>
        <div className="create-deal-desktop-right-div">
          <UploadImage inputImage={inputImage} setInputImage={setInputImage} />
          <UploadDealLocation />
        </div>
        <div className="create-deal-button-wrapper">
          <Button
            color={
              dealInfo.dealType === "Sharing"
                ? "yellow"
                : dealInfo.dealType === "Trade"
                ? "pink"
                : "indigo"
            }
            onClick={createDeal}
          >
            생성하기
          </Button>
        </div>
      </div>
    </>
  );
}
