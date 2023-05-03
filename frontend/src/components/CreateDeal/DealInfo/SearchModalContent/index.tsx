import React, { useState } from "react";
import { concertAPI } from "@api/apis";
import SearchBar from "@components/common/SearchBar";
import ConcertList from "@components/SearchPage/ConcertList";

export interface ConcertInterface {
  imageUrl: string;
  kopisConcertId: string;
  place: string;
  startDate: string;
  title: string;
}

export type ConcertList = ConcertInterface[];

export default function index() {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [hasResult, setHasResult] = useState(false);
  const [concertInfoList, setConcertInfoList] = useState<ConcertList>([]);

  const searchHandler = () => {
    setIsLoading(true); // 데이터 받아오는 중이므로 isLoading 상태 변경
    const result = concertAPI.getAllConcert(searchInput);
    result.then((res: any) => {
      setConcertInfoList(res.data.result.concertInfoList);

      // 검색 결과가 없을 때 (0건 일 때)
      if (res.data.result.concertInfoList.length === 0) {
        setHasResult(false);
      } else {
        setHasResult(true);
      }
      setIsLoading(false); // 데이터 받아왔으므로 isLoading 상태 변경
    });
  };

  return (
    <div className="search-modal-content-component-container">
      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSubmit={searchHandler}
      />
      {isLoading && <p>Loading...</p>}
      {hasResult && !isLoading && (
        <ConcertList concertInfoList={concertInfoList} flag="fromCreate" />
      )}
      {!hasResult && !isLoading && <p>검색 결과가 없습니다.</p>}
    </div>
  );
}
