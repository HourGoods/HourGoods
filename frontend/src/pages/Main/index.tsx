import React from "react";
import { Link } from "react-router-dom";
import simpleLogo from "@assets/simpleLogo.svg";
import { UserIcon, UsersIcon } from "@heroicons/react/24/solid";
import "./index.scss";

export default function Main() {
  return (
    <div className="main-page-container">
      <div className="title-texts-container">
        <h3>콘서트장에서 만나는 내 손 안의 거래장</h3>
        <h2>HourGoods</h2>
        <img src={simpleLogo} alt="" />
      </div>
      <div className="about-texts-container">
        <h3>ABOUT HOURGOODS</h3>
        <div className="icon-text-fist-wrapper">
          <UsersIcon />
          <p>혹시 이거 무슨 줄이에요?</p>
        </div>
        <div className="icon-text-right-wrapper">
          <p>뫄뫄랑 솨솨 교환 가능한가요?</p>
          <UserIcon />
        </div>
        <div className="icon-text-last-wrapper">
          <UserIcon />
          <p>제시 부탁드려요 🙏</p>
        </div>
      </div>
      <div className="footer-texts-container">
        <p>HourGoods는 콘서트장에서의 다양한 거래들을 위해 탄생했습니다.</p>
      </div>
      <div className="footer-texts-container">
        <p>HourGoods, 이렇게 이용해보세요!</p>
      </div>
      <div className="how-to-use-div-box">
        <p>How to use HourGoods!</p>
      </div>
      <footer>
        <p>
          ABOUT US <br /> 삼성청년SW아카데미 || A204 공조한 김규연 김동현 박다솜
          임길현 허예지
        </p>
      </footer>
    </div>
  );
}
