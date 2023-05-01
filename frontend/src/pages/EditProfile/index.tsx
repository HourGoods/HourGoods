/* eslint-disable  */

import { memberAPI } from "@api/apis";
import { UserStateAtom } from "@recoils/user/Atom";
import React from "react";
import { useRecoilState } from "recoil";

export default function index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  const nickname = "이지은";
  const imgUrl =
    "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/06/28/612b6ff6-5081-4b54-a22c-38d716229c41.jpg";

  const clickHandler = () => {
    setUserInfo({
      nickname: nickname,
      imgUrl: imgUrl,
    });
    memberAPI.signup(userInfo);
  };

  return (
    <>
      <div>수정페이지</div>
      <button onClick={clickHandler}>회원가입 되나요?</button>
    </>
  );
}
