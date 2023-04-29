import React from "react";
import UploadImage from "@components/CreateDeal/UploadImage";
import DealInfo from "@components/CreateDeal/DealInfo";
import UploadDealLocation from "@components/CreateDeal/UploadDealLocation";
import Button from "@components/common/Button";
import "./index.scss";

export default function index() {
  return (
    <div className="create-deal-page-container">
      <div className="create-deal-desktop-left-div">
        <DealInfo />
      </div>
      <div className="create-deal-desktop-right-div">
        <UploadImage />
        <UploadDealLocation />
      </div>
      <Button color="yellow">생성하기</Button>
    </div>
  );
}
