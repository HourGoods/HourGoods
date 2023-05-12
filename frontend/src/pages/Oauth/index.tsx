/* eslint-disable */
import Loading from "@components/common/Loading";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { UserStateAtom, AuthStateAtom } from "@recoils/user/Atom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    if (nickname === "") {
      const newUserInfo = { ...userInfo };
      newUserInfo.email = email;
      setUserInfo(newUserInfo);
      navigate("/update/profile", { state: { mypage: false } });
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
      sessionStorage.setItem("isLogin", "true");
      setCookie("refreshToken", refreshToken);
      navigate("/mypage");
      toast.success(`${nickname}님 환영합니다!`);
    }
  }, []);
  1;
  return (
    <>
      <ToastContainer />
      <Loading />
    </>
  );
}
