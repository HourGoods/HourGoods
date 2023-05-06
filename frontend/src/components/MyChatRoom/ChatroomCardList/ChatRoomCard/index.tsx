import React from "react";
import { Link } from "react-router-dom";

export default function index() {

  return (
    <Link to="/mychatroom/1">
      <button
        className="chatromm-card-container"
        type="button"
      >
        <div className="chatroom-left-section">
          <img
            src="https://images.chosun.com/resizer/jaSyPbMDmLN-xotQv6KvTGKw8ZQ=/530x712/smart/cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/J4I5BTEYRIVL6VVTG7M2SFPEXU.jpg"
            alt="프로필이미지"
          />
        </div>
        <div className="chatroom-right-section">
          <div className="chatroom-name-datetime-container">
            <p className="chatroom-profile-name">아이유사랑해</p>
            <p className="chatroom-recent-datetime">3분전</p>
          </div>
          <div className="chatroom-recent-msg-wrapper">
            <p className="recent-msg">
              안녕하세요! 구매하고싶어요! 이거는 몇자 제한이 있을까요 언제 ...
              처리가 될까요 안
              되나요????ㄴㅇ리ㅏㅓㄴ이라ㅓ니아ㅓ리나언이라ㅓㄴ이ㅏㅓ
            </p>
          </div>
        </div>
      </button>
    </Link>
  );
}
