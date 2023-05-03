import React, { useEffect } from "react";
import UploadImage from "@components/CreateDeal/UploadImage";
import DealInfo from "@components/CreateDeal/DealInfo";
import UploadDealLocation from "@components/CreateDeal/UploadDealLocation";
import Button from "@components/common/Button";
import { useRecoilValue } from "recoil";
import { dealState } from "@recoils/deal/Atoms";
import "./index.scss";

export default function index() {
  const dealInfo = useRecoilValue(dealState);

  useEffect(() => {
    console.log(dealInfo);
    // 최초 렌더링 시 최상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  const createDeal = () => {
    console.log(dealInfo);
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
