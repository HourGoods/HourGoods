import React from "react";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/solid";
import "./index.scss";
import logo from "@assets/logo.svg";

export default function Nav() {
  return (
    <header>
      <div className="navbar-container">
        <img src={logo} alt="로고" />
        <p>실시간</p>
        <p>탐색하기</p>
        {/* <UserCircleIcon /> */}
      </div>
    </header>
  );
}
