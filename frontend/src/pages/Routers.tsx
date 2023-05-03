import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "@pages/Main";
import RealTimePage from "@pages/RealTime";
import SearchPage from "@pages/Search";
import LoginPage from "@pages/Login";
import MyPage from "@pages/MyPage";
import MyChatRoom from "@pages/MyChatRoom";
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

export default function Routers() {
  return (
    <Routes>
      {/* 임시 메인페이지 */}
      <Route path="/" element={<TempMain />} />
      <Route path="/main" element={<MainPage />} />
      {/* 기존 메인페이지 */}
      {/* <Route path="/" element={<MainPage />} /> */}
      <Route path="/realtime" element={<RealTimePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth" element={<Oauth />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mychatroom" element={<MyChatRoom />} />
      <Route path="/create/deal" element={<CreateDealPage />} />
      {/* 주소 변경 필요 */}
      <Route path="/concertname" element={<ConcertDeal />} />
      <Route path="/deal/detail" element={<DealDetail />} />
      <Route path="/ticket" element={<Ticket />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/edit" element={<EditProfile />} />
      <Route path="/auction" element={<Auction />} />

      <Route path="/updateprofile" element={<UpdateProfile />} />
    </Routes>
  );
}
