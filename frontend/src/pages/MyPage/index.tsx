import React from "react";
import UserInfo from "@components/MyPage/UserInfo";
import UserCash from "@components/MyPage/UserCash";
import UserDeal from "@components/MyPage/UserDeal";
import "./index.scss";

export default function index() {
  return (
    <div className="mypage-main-container">
      <div className="mypage-contents-container">
        <UserInfo />
        <UserCash />
        <UserDeal />
      </div>
    </div>
  );
}
