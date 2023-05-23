/* eslint-disable react/react-in-jsx-scope */
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const MainPage = lazy(() => import("@pages/Main22"));
const RealTimePage = lazy(() => import("@pages/RealTime"));
const SearchPage = lazy(() => import("@pages/Search"));
const SignupPage = lazy(() => import("@pages/Signup"));
const MyPage = lazy(() => import("@pages/MyPage"));
const MyChatRoom = lazy(() => import("@pages/MyChatRoom"));
const PrivateChat = lazy(() => import("@pages/MyChatRoom/PrivateChat"));
const MeetingDeal = lazy(() => import("@pages/MeetingDeal"));
const CreateDealPage = lazy(() => import("@pages/CreateDeal"));
const ConcertDeal = lazy(() => import("@pages/ConcertDeal"));
const DealDetail = lazy(() => import("@pages/DealDetail"));
const Payment = lazy(() => import("@pages/Payment"));
const Payresult = lazy(() => import("@pages/Payresult"));
const Oauth = lazy(() => import("@pages/Oauth"));
const Ticket = lazy(() => import("@pages/Ticket"));
const UpdateProfile = lazy(() => import("@pages/UpdateProfile"));
const Auction = lazy(() => import("@pages/Auction"));
const ErrorPage = lazy(() => import("@pages/ErrorPage"));
const PrivateRoute = lazy(() => import("./PrivateRoute"));

export default function Routers() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* <Route path="/" element={<MainPage />} /> */}
        <Route path="/" element={<RealTimePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
          <Route path="/payresult" element={<Payresult />} />
          <Route path="/mychatroom" element={<MyChatRoom />} />
          <Route path="/mychatroom/:chattingroomId" element={<PrivateChat />} />
          <Route path="/meetingdeal/:dealId" element={<MeetingDeal />} />
          <Route path="/auction/:dealId" element={<Auction />} />
          <Route path="/update/profile" element={<UpdateProfile />} />
        </Route>

        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
}
