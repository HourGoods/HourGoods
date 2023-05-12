import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { AuthStateAtom } from "@recoils/user/Atom";

export default function PrivateRoute() {
  const sessionLogin = localStorage.getItem("isLogin");
  // const { isLogin } = useRecoilValue(AuthStateAtom)

  if (sessionLogin) {
    // 인증이 반드시 필요한 페이지
    return <Outlet />;
  }
  alert("로그인이 필요한 서비스입니다.");
  // 미로그인 유저는 로그인으로 이동
  window.location.href = "https://hourgoods.co.kr/oauth2/authorization/kakao";
  return null;
}
