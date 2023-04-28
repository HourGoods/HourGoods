import React, { useState } from "react";
import UserInfo from "@components/MyPage/UserInfo";
import UserCash from "@components/MyPage/UserCash";
import UserDeal from "@components/MyPage/UserDeal";
import "./index.scss";
import Modal from "@components/common/Modal";

export default function index() {
  const [modalOpen, setModalOpen] = useState(false);
  const modalClickHandler = () => {
    setModalOpen(true);
  };
  return (
    <div className="mypage-main-container">
      <div className="mypage-contents-container">
        <UserInfo />
        <UserCash />
        <UserDeal />
        {modalOpen && (
          <Modal setModalOpen={setModalOpen}>
            <h1>여기에</h1>
            <h3>원하는 내용을</h3>
            <p>추가하시면 됩니다.</p>
          </Modal>
        )}
      </div>
    </div>
  );
}
