import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function index() {
  return (
    <div className="UserInfoBackground">
      <div className="UserInfoBody">
        <span>아이유사랑해</span>
        <Link to="/">
          <button type="button">
            {`프로필 수정하기 `}
            <ChevronRightIcon />
          </button>
        </Link>
      </div>
      <img alt="프로필 사진" />
    </div>
  );
}
