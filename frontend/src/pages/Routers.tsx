import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "@pages/Main";
import RealTimePage from "@pages/RealTime";
import SearchPage from "@pages/Search";
import LoginPage from "@pages/Login";
import MyPage from "@pages/MyPage";
import TempMain from "@pages/TempMain";
import CreateDealPage from "@pages/CreateDeal";
import ConcertDeal from "@pages/ConcertDeal";
import Ticket from "@pages/Ticket";

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
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
}
