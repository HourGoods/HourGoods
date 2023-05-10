import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { chattingAPI } from "@api/apis";
import DealCard from "@components/common/DealCard";
import InputMsgBox from "@components/common/InputMsgBox";
import Button from "@components/common/Button";
import Modal from "@components/common/Modal";
import ChatContent from "./ChatContent";

export interface PrivatChatMessage {
  nickname: string;
  isUser: boolean;
  sendTime: string;
  content: string;
}

// 23.05.10 10:42
// chattingRoomId 값에 포함된 dealId 값으로 api 요청 새로보내는 로직 짜서 DealCard 수정할 것

export default function index() {
  const navigate = useNavigate();
  const location = useLocation();
  const dealInfo = location.state.dealinfo;
  const chattingRoomId = location.state.chatId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatMsgList, setChatMsgList] = useState<PrivatChatMessage[]>([]);

  const meetModalHandler = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    // console.log(dealInfo);
    const req = chattingAPI.getmychatMsg(chattingRoomId);
    req
      .then((res) => {
        // 채팅내용 가져오기
        setChatMsgList(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <div className="private-chatroom-all-container">
        <div className="private-chatroom-box-container">
          <div className="box-upper-wrapper">
            <div className="chatroom-dealcard">
              <DealCard dealInfo={dealInfo} />
            </div>
            <ChatContent chatMsgList={chatMsgList} />
          </div>
          <div className="box-bottom-wrapper">
            {/* <InputMsgBox type="msg" onClick={sendMsgHandler} /> */}
          </div>
        </div>
      </div>


      {/* 만나서 거래하기  */}
      <Button color="pink" onClick={meetModalHandler}>
        만나서 거래하기
      </Button>
      {isModalOpen && (
        <Modal setModalOpen={setIsModalOpen}>
          <p>만나서 거래를 하시겠습니까?</p>
          <p>현재 위치가 상대방에게 공유됩니다.</p>
          <Button
            size="small"
            color="indigo"
            // dealInfo.dealId 값으로 navigate 시킬 것
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
