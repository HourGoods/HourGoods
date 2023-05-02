import React, { useState } from "react";
import { useNavigate } from "react-router";
import SearchBar from "@components/common/SearchBar";
import ConcertCard from "@components/common/ConcertCard";
import NoResult from "@components/SearchPage/NoResult";
import { concertAPI } from "@api/apis";
import "./index.scss";

export default function index() {
  const [tempState, setTempState] = useState<Record<string, boolean>>({
    basic: true,
    hasResult: false,
    noResult: false,
  });
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();

  const tempPageHandler = (page: keyof typeof tempState) => {
    if (page === "hasResult") {
      navigate("/concertname");
    } else {
      const changeTempState: typeof tempState = {
        basic: false,
        hasResult: false,
        noResult: false,
      };
      changeTempState[page] = true;
      setTempState(changeTempState);
    }
  };

  const searchHandler = () => {
    console.log("하위");
    console.log(searchInput);
    const result = concertAPI.getAllConcert(searchInput);
    result.then((res: any) => {
      console.log(res);
    });
  };

  return (
    <div className="search-page-container">
      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSubmit={searchHandler}
      />
      {/* 거래가 가능한 콘서트 목록을 모두 띄워줍니다 */}
      <div className="search-temp-buttons-container">
        <p>임시 버튼입니다</p>
        <button type="button" onClick={() => tempPageHandler("basic")}>
          초기화
        </button>
        <button type="button" onClick={() => tempPageHandler("hasResult")}>
          검색결과 있음
        </button>
        <button type="button" onClick={() => tempPageHandler("noResult")}>
          검색결과 없음
        </button>
      </div>
      {tempState.basic && (
        <div>
          <ConcertCard />
          <ConcertCard />
          <ConcertCard />
          <ConcertCard />
        </div>
      )}
      {tempState.noResult && <NoResult />}
    </div>
  );
}
