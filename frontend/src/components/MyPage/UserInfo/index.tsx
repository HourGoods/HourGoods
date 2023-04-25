import React from "react";
import { Link } from "react-router-dom";

function index() {
  return (
    <div>
      <div>
        <p>아이유사랑해</p>
        <Link to="/">
          <button type="button">프로필 수정하기</button>
        </Link>
      </div>
      <img alt="프로필 사진" />
    </div>
  );
}

export default index;
