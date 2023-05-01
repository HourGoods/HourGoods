/* eslint-disable */
import Loading from "@components/common/Loading";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router";
// 회원가입 성공시 /edit으로 이동

export default function SocialLogin() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["refreshToken"]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const registrationId = params.get("registrationId") || "";
    const accessToken = params.get("access_token") || "";

    // if (accessToken && registrationId) {
    //   memberAPI
    //     .socialLogin(accessToken, registrationId)
    //     .then((res) => {
    //       const snsUserInfo = res.data.result;
    //       const { nickname } = res.data.result;
    //       // Store에 user 정보 저장
    //       dispatch(setLogin(snsUserInfo));

    //       // token 저장
    //       const { accessToken, refreshToken } = snsUserInfo;
    //       sessionStorage.setItem("accessToken", accessToken);
    //       setCookie("refreshToken", refreshToken);

    //       alert(`${nickname}님 환영합니다!`);
    //       navigate("/mypage");
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  }, []);

  return <Loading />;
}
