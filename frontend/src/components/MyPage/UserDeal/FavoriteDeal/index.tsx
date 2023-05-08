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
  //     dealId: 2,
  //     dealTypeName: "sports",
  //     imageUrl: "https://avatars.githubusercontent.com/u/88919138?v=4",
  //     title: "Soccer Game",
  //     startTime: "2023-05-08T10:00:00.000Z",
  //     endTime: "2023-05-08T12:00:00.000Z",
  //     limitation: 20,
  //     price: 9.99,
  //     isBookmarked: true,
  //     meetingLocation: "456 Oak Ave, Anytown",
  //   },
  //   {
  //     dealId: 3,
  //     dealTypeName: "travel",
  //     imageUrl: "https://avatars.githubusercontent.com/u/88919138?v=4",
  //     title: "Beach Getaway",
  //     startTime: "2023-05-08T14:00:00.000Z",
  //     endTime: "2023-05-09T12:00:00.000Z",
  //     limitation: 8,
  //     price: 199.99,
  //     isBookmarked: false,
  //     meetingLocation: "789 Elm St, Anytown",
  //   },
  //   {
  //     dealId: 4,
  //     dealTypeName: "food",
  //     imageUrl: "https://avatars.githubusercontent.com/u/88919138?v=4",
  //     title: "Sushi Night",
  //     startTime: "2023-05-10T18:00:00.000Z",
  //     endTime: "2023-05-10T21:00:00.000Z",
  //     limitation: 12,
  //     price: 29.99,
  //     isBookmarked: false,
  //     meetingLocation: "123 Main St, Anytown",
  //   },
  // ];

  useEffect(() => {
    mypageAPI
      .favoriteDeal(-1)
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
