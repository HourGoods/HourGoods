import React, { useState } from "react";
import UserInfo from "@components/MyPage/UserInfo";
import UserCash from "@components/MyPage/UserCash";
import UserDeal from "@components/MyPage/UserDeal";
import "./index.scss";
import Modal from "@components/common/Modal";
import { useRecoilState } from "recoil";
import { isDeleteCardModal } from "../../recoils/mypageModal/Atoms";

export default function index() {
  const [modalOpen, setModalOpen] = useRecoilState(isDeleteCardModal);
  const modalClickHandler = () => {
    setModalOpen(true);
    console.log(isDeleteCardModal);
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
