import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "@components/common/Modal";
import Button from "@components/common/Button";
import "./index.scss";
import { useRecoilState } from "recoil";
import { isAuctionAlarmModal } from "@recoils/mypageModal/Atoms";

export default function Main() {
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useRecoilState(isAuctionAlarmModal);

  const modalClickHandler = () => {
    setModalOpen(true);
  };

  return (
    <div>
      <div className="mainpage-button-container">
        {/* 모달 버튼은 사라질 겁니다. */}
        <Button onClick={modalClickHandler} color="dark-blue">
          모달테스트
        </Button>
        {modalOpen && (
          <Modal setModalOpen={setModalOpen}>
            <h1>여기에</h1>
            <h3>원하는 내용을</h3>
            <p>추가하시면 됩니다.</p>
            <Button color="purple">버튼도 추가됩니다.</Button>
          </Modal>
        )}
        {success === 1 && (
          <Modal setSuccess={setSuccess}>
            <h2 className="success-h2">🎉낙찰 성공🎉</h2>
            <p className="success-p">
              최종가 <span style={{ color: "#4f46e5" }}>37000</span> 원
            </p>
            <p className="success-p">
              낙찰자 <span style={{ color: "#4f46e5" }}>아이유사랑해</span> 님
            </p>
          </Modal>
        )}
        {success === 2 && (
          <Modal setSuccess={setSuccess}>
            <h2 className="success-h2">😥낙찰 실패😥</h2>
            <p className="success-p">다음 경매 땐 꼭 성공하세요!</p>
          </Modal>
        )}
      </div>
      <div className="temp-direction-div">
        <p>임시 바로가기 모음</p>
        <Link to="/create/deal">
          <button type="button">Deal 생성 바로가기</button>
        </Link>
        <Link to="/auction">
          <Button>경매장 입장하기</Button>
        </Link>
      </div>
      <h5>임시 가이드라인 정보</h5>
      <p>mobile: red</p>
      <p>tablet: green</p>
      <p>desktop: blue</p>
    </div>
  );
}
