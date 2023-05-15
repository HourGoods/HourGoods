/* eslint-disable react/no-array-index-key */
import React, { useRef, useState, useEffect } from "react";
import { mypageAPI } from "@api/apis";
import "swiper/css";
import "swiper/css/pagination";
import "./index.scss";
// import { Pagination } from "swiper";
import UserDealCard from "@components/MyPage/UserDealCard";

export default function index() {
  const [dealList, setDealList] = useState([]);

  useEffect(() => {
    mypageAPI
      .favoriteDeal()
      .then((res) => {
        setDealList(res.data.result.dealInfoList);
        console.log(res.data.result.dealInfoList);
        console.log(dealList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        rowGap: "50px",
        columnGap: "30px",
        marginTop: "30px",
      }}
    >
      {/* {dealList.map((deal, index) => (
        <div key={index}>
          <UserDealCard deal={deal} />
        </div>
      ))} */}
      {dealList.length === 0 ? (
        <div style={{ width: "100%", marginTop: "50px", lineHeight: "1.5" }}>
          찜한 Deal이 없어요 <br />
          Deal을 찜하러 가보세요!
        </div>
      ) : (
        dealList.map((deal, index) => (
          <div key={index}>
            <UserDealCard deal={deal} />
          </div>
        ))
      )}
    </div>
  );
}
