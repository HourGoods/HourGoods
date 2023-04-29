import React from "react";
import UploadImage from "@components/CreateDeal/UploadImage";
import DealInfo from "@components/CreateDeal/DealInfo";
import UploadDealLocation from "@components/CreateDeal/UploadDealLocation";
import "./index.scss";

export default function index() {
  return (
    <div className="create-deal-page-container">
      <DealInfo />
      <UploadImage />
      <UploadDealLocation />
    </div>
  );
}
