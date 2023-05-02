import React, { useEffect } from "react";
import DealBanner from "@components/DealDetail/DealBanner";
import DealInfo from "@components/DealDetail/DealInfo";
import DealEnterButton from "@components/DealDetail/DealEnterButton";
import "./index.scss";

export default function index() {
  return (
    <div className="deal-detail-page-container">
      <DealBanner />
      <hr />
      <DealInfo />

      <DealEnterButton />
    </div>
  );
}
