import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "@pages/Main";
import RealTimePage from "@pages/RealTime";
import SearchPage from "@pages/Search";
import LoginPage from "@pages/Login";
import MyPage from "@pages/MyPage";
import MyChatRoom from "@pages/MyChatRoom";
import PrivateChat from "@pages/MyChatRoom/PrivateChat";
import MeetingDeal from "@pages/MeetingDeal";
import TempMain from "@pages/TempMain";
import CreateDealPage from "@pages/CreateDeal";
import ConcertDeal from "@pages/ConcertDeal";
import DealDetail from "@pages/DealDetail";
import Payment from "@pages/Payment";
import Oauth from "@pages/Oauth";
import EditProfile from "@pages/EditProfile";
import Ticket from "@pages/Ticket";
import UpdateProfile from "@pages/UpdateProfile";
import Auction from "@pages/Auction";
import PrivateRoute from "./PrivateRoute"; // 가장 마지막으로 import 위치 유지해주세요

export default function Routers() {
  return (
    <Routes>
      {/* 임시 메인페이지 */}
      {/* <Route path="/" element={<TempMain />} />
      <Route path="/main" element={<MainPage />} /> */}
      {/* 기존 메인페이지 */}
      <Route path="/" element={<MainPage />} />
      <Route path="/realtime" element={<RealTimePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth" element={<Oauth />} />
      <Route path="/concert/:concertId" element={<ConcertDeal />} />

      {/* 인증을 반드시 해야지만 접속 가능한 페이지 정의 */}
      <Route element={<PrivateRoute />}>
        <Route path="/create/deal/:concertId" element={<CreateDealPage />} />
        <Route path="/create/deal" element={<CreateDealPage />} />
        <Route path="/deal/detail/:dealId" element={<DealDetail />} />
        {/* ----------------- 유저 ----------------- */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/mychatroom" element={<MyChatRoom />} />
        <Route path="/mychatroom/:chattingroomId" element={<PrivateChat />} />
        <Route path="/meetingdeal/:dealId" element={<MeetingDeal />} />
        <Route path="/auction/:dealId" element={<Auction />} />
      </Route>

      <Route path="/edit" element={<EditProfile />} />

      <Route path="/update/profile" element={<UpdateProfile />} />
    </Routes>
  );
}
