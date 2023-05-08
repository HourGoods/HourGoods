import React, { useRef, useState, useEffect } from "react";
import { mypageAPI } from "@api/apis";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./index.scss";
// import { Pagination } from "swiper";
import UserDealCard from "@components/MyPage/UserDealCard";

export default function index() {
  const [dealList, setDealList] = useState([]);
  // const dealList = [
  //   {
  //     dealId: 5,
  //     dealTypeName: "arts",
  //     imageUrl: "https://avatars.githubusercontent.com/u/88919138?v=4",
  //     title: "Art Exhibit",
  //     startTime: "2023-05-11T12:00:00.000Z",
  //     endTime: "2023-05-11T18:00:00.000Z",
  //     limitation: 50,
  //     price: 5.99,
  //     isBookmarked: true,
  //     meetingLocation: "456 Oak Ave, Anytown",
  //   },
  //   {
  //     dealId: 6,
  //     dealTypeName: "music",
  //     imageUrl: "https://avatars.githubusercontent.com/u/88919138?v=4",
  //     title: "Live Music",
  //     startTime: "2023-05-12T20:00:00.000Z",
  //     endTime: "2023-05-12T23:00:00.000Z",
  //     limitation: 30,
  //     price: 19.99,
  //     isBookmarked: false,
  //     meetingLocation: "789 Elm St, Anytown",
  //   },
  //   {
  //     dealId: 7,
  //     dealTypeName: "sports",
  //     imageUrl: "https://avatars.githubusercontent.com/u/88919138?v=4",
  //     title: "Basketball Game",
  //     startTime: "2023-05-13T15:00:00.000Z",
  //     endTime: "2023-05-13T17:00:00.000Z",
  //     limitation: 15,
  //     price: 4.99,
  //     isBookmarked: true,
  //     meetingLocation: "123 Main St, Anytown",
  //   },
  // ];
  useEffect(() => {
    mypageAPI
      .participateDeal(-1)
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
          <UserDealCard deal={deal} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
