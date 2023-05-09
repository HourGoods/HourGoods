import React, { useEffect } from "react";
import DealCard from "@components/common/DealCard";
import SearchBar from "@components/common/SearchBar";
import { ClockIcon } from "@heroicons/react/24/solid";
import { concertAPI } from "@api/apis";
import { useRecoilValue } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";

export default function index(props: any) {
  const { inConcertList, concertDealList, setConcertDealList } = props;
  const userInfo = useRecoilValue(UserStateAtom);

  useEffect(() => {
    if (inConcertList.length === 0) {
      setConcertDealList([]);
    }
    const concert = inConcertList[0];
    if (concert) {
      concertAPI
        .getConcertDealList(concert.concertId, -1, "All", "", userInfo.nickname)
        .then((res) => {
          return setConcertDealList(res.data.result.dealInfoList);
        });
    }

    // if (inConcertList.length > 0) {
    //   Promise.all(
    //     inConcertList.map((concert: any) => {
    //       return concertAPI
    //         .getConcertDealList(
    //           concert.concertId,
    //           -1,
    //           "All",
    //           "",
    //           userInfo.nickname
    //         )
    //         .then((res) => {
    //           return res.data.result.dealInfoList;
    //         });
    //     })
    //   ).then((results) => {
    //     console.log("새로운 콘서트별 deal 정보", results);
    //     setConcertDealList(results.flat());
    //   });
    // }
  }, [inConcertList]);

  return (
    <div className="realtime-deal-card-list-container">
      <div className="realtime-page-title-div">
        <ClockIcon />
        <p className="realtime-page-component-title-p">실시간 Time Deal</p>
      </div>
      {inConcertList.length < 1 ? (
        <>
          <p className="realtime-page-helper-p">
            콘서트 범위 안에서만 Deal을 확인할 수 있어요.
          </p>
          <p>Deal카드가 없습니다</p>
        </>
      ) : (
        <>
          <p className="realtime-page-helper-p">
            콘서트 현장에서 원하는 거래를 찾아봐요!
          </p>
          <SearchBar />
          {concertDealList.map((dealInfo: any) => {
            return (
              <div key={dealInfo.dealId}>
                <DealCard dealInfo={dealInfo} />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
