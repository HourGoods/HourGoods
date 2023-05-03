/* eslint-disable */
import Loading from "@components/common/Loading";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { UserStateAtom, AuthStateAtom } from "../../recoils/user/Atom";

export default function Oauth() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["refreshToken"]);
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  const [authState, setAuthState] = useRecoilState(AuthStateAtom);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") || "";
    const nickname = decodeURI(params.get("nickname") || "");
    const imageUrl = params.get("imageUrl") || "";

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
    //     navigate("/");.
    //   }
    // }, []);

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
    } else {
      setUserInfo({
        email: email,
        nickname: nickname,
        imageUrl: imageUrl,
      });
      const accessToken = params.get("access") || "";
      const refreshToken = params.get("refresh") || "";
      setAuthState({ isLogin: true, token: accessToken });
      sessionStorage.setItem("accessToken", accessToken);
      setCookie("refreshToken", refreshToken);
      navigate("/main");
      alert(`${nickname}님 환영합니다!`);
    }
  }, []);
  1;
  return <Loading />;
}