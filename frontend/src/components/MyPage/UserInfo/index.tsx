import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function index() {
  return (
    <div className="userinfo-container">
      <div className="userinfo-wrapper">
        <p className="userid">아이유사랑해</p>
        <Link to="/updateprofile">
          <button type="button" className="edit-profile-button">
            {`프로필 수정하기 `}
            <ChevronRightIcon />
          </button>
        </Link>
      </div>
      <UserCircleIcon />
      {/* <img alt="프로필 사진" className="profile" /> */}
    </div>
  );
}