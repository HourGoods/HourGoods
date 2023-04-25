import React from "react";
import UserInfo from "@components/MyPage/UserInfo";
import UserCash from "@components/MyPage/UserCash";
import UserDeal from "@components/MyPage/UserDeal";

export default function index() {
  return (
    <div>
      <UserInfo />
      <UserCash />
      <UserDeal />
    </div>
  );
}
