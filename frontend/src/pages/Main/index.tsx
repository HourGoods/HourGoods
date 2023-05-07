import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

export default function Main() {
  return (
    <div>
      <div className="temp-direction-div">
        <p>임시 바로가기 모음</p>
        <Link to="/create/deal">
          <button type="button">Deal 생성 바로가기</button>
        </Link>
      </div>
      <h5>임시 가이드라인 정보</h5>
      <p>mobile: red</p>
      <p>tablet: green</p>
      <p>desktop: blue</p>
    </div>
  );
}
