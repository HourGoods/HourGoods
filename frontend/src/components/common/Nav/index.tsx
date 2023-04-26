/*eslint-disable*/
import React, { useState } from "react";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import "./index.scss";
import logo from "@assets/logo.svg";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="web-navbar-wrapper">
        <div className="web-navbar-logo-menu">
          <img src={logo} alt="로고" />
          <p>실시간</p>
          <p>탐색하기</p>
        </div>
        <div className="web-navbar-profile">
          <UserCircleIcon />
        </div>
      </div>
      <div className="mobile-navbar-wrapper">
        <img src={logo} alt="로고" />
        {isOpen ? "" : <Bars3Icon onClick={toggleMenu} />}
        {isOpen && (
          <div
            className={`mobile-sidebar-wrapper ${
              isOpen ? "" : "sidebar-closed"
            }`}
          >
            <div className="mobile-nav-close-btn">
              <XMarkIcon onClick={toggleMenu} />
            </div>
            <div className="mobile-sidebar-menu">
              <p>실시간</p>
              <p>탐색하기</p>
              <p>마이페이지</p>
              <p>로그인</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
