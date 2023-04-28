// Main.tsx
import React, { useState } from "react";
import Modal from "@components/common/Modal";
import Button from "@components/common/Button";
import "./index.scss";

export default function Main() {
  const [modalOpen, setModalOpen] = useState(false);

  const modalClickHandler = () => {
    setModalOpen(true);
  };

  // const baseUrl = "https://k8a204.p.ssafy.io";
  const baseUrl = "http://localhost:3000";
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
      <h5>임시 가이드라인 정보</h5>
      <p>mobile: red</p>
      <p>tablet: green</p>
      <p>desktop: blue</p>
    </div>
  );
}
