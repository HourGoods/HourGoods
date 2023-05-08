/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useRef, useState, useEffect } from "react";
import { mypageAPI } from "@api/apis";
import { Swiper, SwiperSlide } from "swiper/react";
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
      .getMyDeal(-1)
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
    <Swiper
      slidesPerView={1}
      spaceBetween={10}
      pagination={{
        clickable: true,
      }}
      breakpoints={{
        320: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        550: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        758: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 50,
        },
      }}
      // modules={[Pagination]}
      className="mySwiper"
    >
      {dealList.map((deal) => (
        <SwiperSlide>
          <UserDealCard getmy={getmy} deal={deal} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
