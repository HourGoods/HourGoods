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
import DropDown from "@components/common/DropDown";
import { AuthStateAtom, UserStateAtom } from "@recoils/user/Atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router";

export default function Nav() {
  // 사이드바 열림여부
  const [isOpen, setIsOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [loginState, setLoginState] = useRecoilState(AuthStateAtom);
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const baseUrl = "https://hourgoods.co.kr";
  const loginUrl = `${baseUrl}/oauth2/authorization/kakao`;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleDropDownClick = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const logoutHandler = () => {
    setUserInfo({ email: "", nickname: "", imageUrl: "" });
    setLoginState({ isLogin: false, token: null });
    toggleMenu();
    navigate("/main");
    alert("안녕히가세요!");
  };

  useModalRef(menuRef, () => setIsOpen(false));

  // 임시 메인페이지에서 nav 가립니다
  // const location = useLocation();
  // if (location.pathname === "/") {
  //   return null;
  // }
  return (
    <nav className="navbar">
      <div className="web-navbar-wrapper">
        <div className="web-navbar-logo-menu">
          <Link to="/">
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
          {loginState.isLogin ? (
            <img
              src={userInfo.imageUrl}
              alt="프로필이미지"
              onClick={handleDropDownClick}
            />
          ) : (
            <UserCircleIcon onClick={handleDropDownClick} />
          )}
          {loginState.isLogin && isDropDownOpen && (
            <DropDown
              menus={[
                { label: "마이페이지", value: "mypage" },
                { label: "나의 채팅", value: "mychatroom" },
                { label: "로그아웃", onClick: logoutHandler },
              ]}
            />
          )}
          {!loginState.isLogin && isDropDownOpen && (
            <DropDown
              menus={[
                {
                  label: "로그인",
                  onClick: () => {
                    window.location.href = loginUrl;
                  },
                },
                { label: "마이페이지", value: "mypage" },
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
        {isOpen && !loginState.isLogin && (
          <div className="mobile-sidebar-wrapper" ref={menuRef}>
            <div className="mobile-nav-close-btn">
              <XMarkIcon onClick={toggleMenu} />
            </div>
            <div className="mobile-sidebar-menu">
              <Link to="realtime" onClick={toggleMenu}>
                <p>실시간</p>
              </Link>
              <Link to="search" onClick={toggleMenu}>
                <p>탐색하기</p>
              </Link>
              <Link to="mypage" onClick={toggleMenu}>
                <p>마이페이지</p>
              </Link>
              <a href={loginUrl}>
                <p>로그인</p>
              </a>
            </div>
          </div>
        )}
        {isOpen && loginState.isLogin && (
          <div className="mobile-sidebar-wrapper" ref={menuRef}>
            <div className="mobile-nav-close-btn">
              <XMarkIcon onClick={toggleMenu} />
            </div>
            <div className="mobile-sidebar-menu">
              <Link to="realtime" onClick={toggleMenu}>
                <p>실시간</p>
              </Link>
              <Link to="search" onClick={toggleMenu}>
                <p>탐색하기</p>
              </Link>
              <Link to="mypage" onClick={toggleMenu}>
                <p>마이페이지</p>
              </Link>
              <Link to="mychatroom" onClick={toggleMenu}>
                <p>나의 채팅</p>
              </Link>
              <p onClick={logoutHandler}>로그아웃</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
