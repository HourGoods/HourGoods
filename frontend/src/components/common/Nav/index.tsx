/* eslint-disable */
import React, { useRef, useState } from "react";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import "./index.scss";
import logo from "@assets/logo.svg";
import { Link, useLocation } from "react-router-dom";
import useModalRef from "@hooks/useModalRef";
import DropDown, { Option } from "@components/common/DropDown";

export default function Nav() {
  // 사이드바 열림여부
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleDropDownClick = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  useModalRef(menuRef, () => setIsOpen(false));

  // 임시 메인페이지에서 nav 가립니다
  const location = useLocation();
  if (location.pathname === "/") {
    return null;
  }
  return (
    <nav className="navbar">
      <div className="web-navbar-wrapper">
        <div className="web-navbar-logo-menu">
          <Link to="/main">
            <img src={logo} alt="로고" />
          </Link>
          <Link to="realtime">
            <p>실시간</p>
          </Link>
          <Link to="search">
            <p>탐색하기</p>
          </Link>
        </div>
        <div className="web-navbar-profile">
          <UserCircleIcon onClick={handleDropDownClick} />
          {isDropDownOpen && (
            <DropDown
              menus={[
                { label: "로그인", value: "login" },
                { label: "마이페이지", value: "mypage" },
                { label: "나의 채팅", value: "mychatroom" },
              ]}
            />
          )}
        </div>
      </div>
      <div className="mobile-navbar-wrapper">
        <Link to="/">
          <img src={logo} alt="로고" />
        </Link>
        {isOpen ? "" : <Bars3Icon onClick={toggleMenu} />}
        {isOpen && (
          <div className="mobile-sidebar-wrapper" ref={menuRef}>
            <div className="mobile-nav-close-btn">
              <XMarkIcon onClick={toggleMenu} />
            </div>
            <div className="mobile-sidebar-menu">
              <Link to="realtime">
                <p>실시간</p>
              </Link>
              <Link to="search">
                <p>탐색하기</p>
              </Link>
              <Link to="login">
                <p>로그인</p>
              </Link>
              <Link to="mypage">
                <p>마이페이지</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
