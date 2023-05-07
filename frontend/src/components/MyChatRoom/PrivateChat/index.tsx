import React, { useState, useEffect } from "react";
import { chattingAPI } from "@api/apis";
import DealCard from "@components/common/DealCard";
import InputMsgBox from "@components/common/InputMsgBox";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Button from "@components/common/Button";
import Modal from "@components/common/Modal";
import { useLocation, useNavigate } from "react-router-dom";

export default function index() {
  const navigate = useNavigate();
  const location = useLocation();
  const dealInfo = location.state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sendMsgHandler = () => {
    //
  };

  const meetModalHandler = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log(dealInfo);
    const req = chattingAPI.getmychatMsg(1);
    req
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <Modal>
        <div className="private-chatroom-all-container">
          <div className="private-chatroom-box-container">
            <div className="box-upper-wrapper">
              <div className="chatroom-dealcard">
                <DealCard dealInfo={dealInfo} />
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
        <Button color="pink" onClick={meetModalHandler}>
          만나서 거래하기
        </Button>
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
