import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

export default function index() {
  return (
    <div>
      <p>메인 페이지, 랜딩 페이지 입니다</p>
      {/* 임시 바로가기 영역 */}
      <p style={{ fontWeight: "700" }}>버튼 영역</p>
      <div>
        <h5>임시 가이드라인 정보</h5>
        <p>mobile: red</p>
        <p>tablet: green</p>
        <p>desktop: blue</p>
      </div>
    </div>
  );
}
