/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import { mypageAPI } from "@api/apis";
import "swiper/css";
import "swiper/css/pagination";
import "./index.scss";
// import { Pagination } from "swiper";
import UserDealCard from "@components/MyPage/UserDealCard";

const getmy = "getmy";

export default function index() {
  const [dealList, setDealList] = useState([]);

  useEffect(() => {
    mypageAPI
      .getMyDeal()
      .then((res) => {
        setDealList(res.data.result.dealInfoList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="deals-container">
      {/* {dealList.map((deal, index) => (
        <div key={index}>
          <UserDealCard getmy={getmy} deal={deal} />
        </div>
      ))} */}
      {dealList.length === 0 ? (
        <div style={{ width: "100%", marginTop: "50px", lineHeight: "1.5" }}>
          생성된 Deal이 없어요 <br />
          Deal를 생성하러 가보세요!
        </div>
      ) : (
        dealList.map((deal, index) => (
          <div key={index}>
            <UserDealCard getmy={getmy} deal={deal} />
          </div>
        ))
      )}
    </div>
  );
}
