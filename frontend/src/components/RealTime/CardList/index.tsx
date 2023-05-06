import React from "react";
import DealCard from "@components/common/DealCard";
import SearchBar from "@components/common/SearchBar";

export default function index(props: any) {
  const { concertList } = props;
  return (
    <div className="realtime-deal-card-list-container">
      <p className="realtime-page-component-title-p">실시간 Time Deal</p>
      <SearchBar />
      <p>딜카드 필요</p>
    </div>
  );
}
