import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRightIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";

export default function index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  const newUserInfo = { ...userInfo };

  const navigate = useNavigate();
  const navigateHandler = () => {
    navigate("/update/profile", { state: { mypage: true } });
  };
  return (
    <div className="userinfo-container">
      <div className="userinfo-wrapper">
        <p className="userid">{newUserInfo.nickname}</p>
        {/* <Link to="/updateprofile"> */}
        <button
          type="button"
          className="edit-profile-button"
          onClick={navigateHandler}
        >
          {`프로필 수정하기 `}
          <ChevronRightIcon />
        </button>
        {/* </Link> */}
      </div>
      {/* <UserCircleIcon /> */}
      <img alt="프로필 사진" className="profile" src={newUserInfo.imageUrl} />
    </div>
  );
}
