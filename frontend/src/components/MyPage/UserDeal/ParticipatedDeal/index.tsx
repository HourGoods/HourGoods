/* eslint-disable react/no-array-index-key */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
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
      .participateDeal()
      .then((res) => {
        setDealList(res.data.result.dealInfoList);
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
          참여한 Deal이 없어요 <br />
          Deal에 참여하러 가보세요!
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
