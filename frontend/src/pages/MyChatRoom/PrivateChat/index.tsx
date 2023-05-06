import React from "react";
import DealCard from "@components/common/DealCard";
import InputMsgBox from "@components/common/InputMsgBox";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Button from "@components/common/Button";
import Modal from "@components/common/Modal";

export default function index() {
  const sendMsgHandler = () => {
    //
  };
  return (
    <div>
      <Modal>
        <div className="private-chatroom-all-container">
          <div className="private-chatroom-box-container">
            <div className="box-upper-wrapper">
              <div className="chatroom-dealcard">
                <DealCard />
              </div>
              <div className="private-chatroom-content-container">
                <div className="not-me-chat">
                  <UserCircleIcon />
                  <div className="not-me-chat-message">
                    <p className="not-me-name">아이유사랑해</p>
                    <p className="not-me-message">남이 보낸 메세지</p>
                  </div>
                </div>
                <div className="its-me-chat">
                  <p className="its-me-chatbox">내가 보낸 메세지</p>
                </div>
              </div>
            </div>
            <div className="box-bottom-wrapper">
              <InputMsgBox type="msg" onClick={sendMsgHandler} />
            </div>
          </div>
        </div>
        <Button color="pink">만나서 거래하기</Button>
      </Modal>
    </div>
  );
}
