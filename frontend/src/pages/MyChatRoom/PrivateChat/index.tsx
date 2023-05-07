import React, { useState } from "react";
import PrivateChat from "@components/MyChatRoom/PrivateChat";
import Button from "@components/common/Button";
import Modal from "@components/common/Modal";
import { useNavigate } from "react-router-dom";

export default function index() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Modal>
        <PrivateChat />
      </Modal>
      {isModalOpen && (
        <Modal setModalOpen={setIsModalOpen}>
          <p>만나서 거래를 하시겠습니까?</p>
          <p>현재 위치가 상대방에게 공유됩니다.</p>
          <Button
            size="small"
            color="indigo"
            onClick={() => navigate("/meetingdeal/1")}
          >
            예
          </Button>
          <Button
            size="small"
            color="white"
            onClick={() => setIsModalOpen(false)}
          >
            아니오
          </Button>
        </Modal>
      )}
    </div>
  );
}
