import React from "react";
import DealCard from "@components/common/DealCard";

export default function index() {
  return (
    <div className="realtime-deal-card-list-container">
      <p className="realtime-page-component-title-p">실시간 Time Deal</p>
      <DealCard />
      <DealCard />
      <DealCard />
    </div>
  );
}
