import React from "react";
import DealCard from "@components/common/DealCard";
import SearchBar from "@components/common/SearchBar";
import { ClockIcon } from "@heroicons/react/24/solid";

export default function index(props: any) {
  const { concertList } = props;
  return (
    <div className="realtime-deal-card-list-container">
      <div className="realtime-page-title-div">
        <ClockIcon />
        <p className="realtime-page-component-title-p">실시간 Time Deal</p>
      </div>
      <p className="realtime-page-helper-p">
        콘서트 범위 안에서만 Deal을 확인할 수 있어요.
      </p>
      <SearchBar />
      <p>딜카드 필요</p>
    </div>
  );
}
