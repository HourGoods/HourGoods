import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "@components/common/Modal";
import Button from "@components/common/Button";
import "./index.scss";
import { useRecoilState } from "recoil";
import { isAuctionAlarmModal } from "../../recoils/mypageModal/Atoms";

export default function Main() {
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useRecoilState(isAuctionAlarmModal);

  const modalClickHandler = () => {
    setModalOpen(true);
  };

  const baseUrl = "https://k8a204.p.ssafy.io";
  // const baseUrl = "http://localhost:3000";
  const loginUrl = `${baseUrl}/oauth2/authorization/kakao`;

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
        <Button color="purple">purple 버튼</Button>
        <Button color="pink">pink 버튼</Button>
        <Button color="yellow">yellow 버튼</Button>
        <Button color="indigo" size="small">
          예
        </Button>
        <Button color="white" size="small">
          아니오
        </Button>
        <Button color="shotpink" size="deal">
          전체보기
        </Button>
        <Button color="spurple" size="deal">
          Hour경매
        </Button>
        <Button color="sindigo" size="deal">
          경매
        </Button>
        <Button color="syellow" size="deal">
          나눔
        </Button>
        <Button color="spink" size="deal">
          거래
        </Button>
        <a href={loginUrl}>
          <Button color="kakao">카카오 로그인</Button>
        </a>
      </div>
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
