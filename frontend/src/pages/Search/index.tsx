/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import SearchBar from "@components/common/SearchBar";
import ConcertList from "@components/SearchPage/ConcertList";
import NoResult from "@components/SearchPage/NoResult";
import { concertAPI } from "@api/apis";
import "./index.scss";

export interface ConcertInterface {
  imageUrl: string;
  kopisConcertId: string;
  place: string;
  title: string;
  startDate?: string;
  startTime?: string;
  concertId?: number;
  longitude?: number;
  latitude?: number;
}

export type ConcertList = ConcertInterface[];

export default function index() {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [hasResult, setHasResult] = useState(false);
  const [concertInfoList, setConcertInfoList] = useState<ConcertList>([]);

  // 최초 로딩시
  const [isAutoResult, setIsAutoResult] = useState(true);

  useEffect(() => {
    // 최대 결과 갯수
    setIsLoading(true)
    const MAX_RESULTS = 30;
    const result = concertAPI.getAllConcert(searchInput, -1);
    result.then((res: any) => {
      const newConcertInfoList = res.data.result.concertInfoList;

      // 검색 결과가 없을 때 (0건 일 때)
      if (newConcertInfoList.length === 0) {
        setHasResult(false);
      } else {
        setHasResult(true);
      }

      // 최대 결과 개수를 초과하면 최신 30개만 유지
      const trimmedConcertInfoList =
        newConcertInfoList.length > MAX_RESULTS
          ? newConcertInfoList.slice(0, MAX_RESULTS)
          : newConcertInfoList;

      setConcertInfoList(trimmedConcertInfoList);
      setIsLoading(false);
    });
  }, []);

  const searchHandler = () => {
    setIsAutoResult(false);
    setIsLoading(true); // 데이터 받아오는 중이므로 isLoading 상태 변경
    const result = concertAPI.getAllConcert(searchInput, -1);
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
    <div className="search-page-container">
      {/* isLoading이 true일 때 로딩 중임을 나타내는 UI를 보여줌 */}
      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSubmit={searchHandler}
      />
      {isLoading && <p>Loading...</p>}
      {hasResult && !isLoading && (
        <div className="search-page-concert-cards-container">
          {isAutoResult && (
            <p className="auto-result-p">🔥 실시간 Hot Concert!</p>
          )}
          <ConcertList concertInfoList={concertInfoList} />
        </div>
      )}
      {!hasResult && !isLoading && <NoResult />}
    </div>
  );
}
