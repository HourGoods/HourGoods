import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "@components/common/Modal";
import Button from "@components/common/Button";
import "./index.scss";

export default function index() {
  const [modalOpen, setModalOpen] = useState(false);

  const modalClickHandler = () => {
    setModalOpen(true);
  };
  return (
    <div>
      <div>
        {/* 모달 버튼은 사라질 겁니다. */}
        <div className="mainpage-test-modal-button">
          <Button
            text="모달테스트"
            onClick={modalClickHandler}
            color="dark-blue"
          />
          {modalOpen && <Modal setModalOpen={setModalOpen} />}
          <Button text="purple 버튼" color="purple" />
          <Button text="pink 버튼" color="pink" />
          <Button text="yellow 버튼" color="yellow" />
        </div>
        <h5>임시 가이드라인 정보</h5>
        <p>mobile: red</p>
        <p>tablet: green</p>
        <p>desktop: blue</p>
      </div>
    </div>
  );
}
