/* eslint-disable */
import Loading from "@components/common/Loading";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "../../recoils/user/Atom";
import { memberAPI } from "@api/apis";

export default function Oauth() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["refreshToken"]);
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const registrationId = "kakao";
    const email = params.get("email") || "";
    const nickname = params.get("nickname");
    const imageUrl = params.get("imageUrl") || "";
    // const accessToken = params.get("access_token") || "";

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

    // useEffect(() => {
    //   const params = new URL(window.location.href).searchParams;
    //   const nickname = decodeURIComponent(params.get("nickname"));
    //   const email = params.get("email");
    //   const registrationId = params.get("registrationId");

    //   if (nickname === "null") {
    //     dispatch(setPendingLogin({ email, registrationId }));
    //     navigate("/signup");
    //   } else {
    //     dispatch(setLogin({ nickname, email, registrationId }));
    //     const accessToken = params.get("access");
    //     const refreshToken = params.get("refresh");
    //     sessionStorage.setItem("accessToken", accessToken);
    //     setCookie("refreshToken", refreshToken);
    //     navigate("/");
    //   }
    // }, []);

    if (nickname === null) {
      setUserInfo({ email: email, registrationId: registrationId });
      navigate("/edit");
      console.log("확인");
    } else {
      // setUserInfo({
      //   email: email,
      //   registrationId: registrationId,
      //   nickname: "이지은",
      //   imageUrl:
      //     "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/06/28/612b6ff6-5081-4b54-a22c-38d716229c41.jpg",
      // });
      // memberAPI.signup(userInfo);
    }
  }, []);

  return <Loading />;
}
