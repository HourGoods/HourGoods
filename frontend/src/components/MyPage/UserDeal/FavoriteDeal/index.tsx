/* eslint-disable react/no-array-index-key */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import { mypageAPI } from "@api/apis";
import "swiper/css";
import "swiper/css/pagination";
import "./index.scss";
import UserDealCard from "@components/MyPage/UserDealCard";

export default function index() {
  const [dealList, setDealList] = useState([]);

  useEffect(() => {
    mypageAPI
      .favoriteDeal()
      .then((res) => {
        setDealList(res.data.result.dealInfoList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="deals-container">
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
