/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
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
import { toast, ToastContainer } from "react-toastify";
import hamburger from "@assets/hamburger.svg";
import "react-toastify/dist/ReactToastify.css";

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

  // 로그인 여부 확인
  const localLogin = localStorage.getItem("isLogin");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleDropDownClick = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const logoutHandler = () => {
    // 다솜 memo : 카카오 로그아웃 api도 적용하면 이제 한 계정의 굴레에서 벗어날 수 있습니다.
    setUserInfo({ email: "", nickname: "", imageUrl: "" });
    setLoginState({ isLogin: false, token: null });
    localStorage.setItem("accessToken", "");
    localStorage.setItem("isLogin", "");
    toggleMenu();
    navigate("/");
    toast.success("안녕히가세요!", {
      autoClose: 2000,
    });
  };

  useModalRef(menuRef, () => setIsOpen(false));

  return (
    <>
      <ToastContainer />
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
            {localLogin && userInfo.imageUrl !== "" ? (
              <img
                src={
                  location.pathname === "/mypage"
                    ? `${hamburger}`
                    : `https://d2uxndkqa5kutx.cloudfront.net/${userInfo.imageUrl}`
                }
                alt="프로필이미지"
                onClick={handleDropDownClick}
              />
            ) : (
              <UserCircleIcon onClick={handleDropDownClick} />
            )}
            {localLogin && isDropDownOpen && (
              <DropDown
                menus={[
                  { label: "마이페이지", value: "mypage" },
                  { label: "나의 채팅", value: "mychatroom" },
                  { label: "로그아웃", onClick: logoutHandler },
                ]}
              />
            )}
            {!localLogin && isDropDownOpen && (
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
                  <p>카카오 로그인</p>
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
    </>
  );
}
