import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "@pages/Main";
import RealTimePage from "@pages/RealTime";
import MyPage from "@pages/MyPage"

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/realtime" element={<RealTimePage />} />
      {/* User */}
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
}
