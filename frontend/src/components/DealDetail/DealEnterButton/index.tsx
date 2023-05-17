/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from "react";
import Button from "@components/common/Button";
import { AuctionAPI, chattingAPI, dealAPI } from "@api/apis";
import { useNavigate } from "react-router-dom";
import Modal from "@components/common/Modal";
import { toast, ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";
import "react-toastify/dist/ReactToastify.css";

export default function index(props: any) {
  const { dealInfo, dealId } = props;
  const navigate = useNavigate();
  const type = dealInfo.dealType;
  const receiver = dealInfo.userNickname;
  const dealid = dealId;
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  const cash = userInfo.cash;
  const price = dealInfo.price || dealInfo.minPrice;
  const [affordable, setAffordable] = useState(false);
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

  const [typeInfo, setTypeInfo] = useState({
    color: "",
    content: "",
  });

  const [sharingNum, setSharingNum] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (type === "Auction") {
      setTypeInfo({
        color: "purple",
        content: "경매장 입장하기",
      });
    } else if (type === "Sharing") {
      setTypeInfo({
        color: "yellow",
        content: "나눔 참여하기",
      });
    } else if (type === "Trade") {
      setTypeInfo({
        color: "pink",
        content: "1:1 채팅하기",
      });
    }
  }, [type]);

  useEffect(() => {
    if (cash >= price) {
      setAffordable(true);
    } else {
      setAffordable(false);
    }
  }, [cash]);

  const dealClickHandler = () => {
    if (!affordable) {
      setIsChargeModalOpen(true);
      return;
    }

    // 1:1 채팅하기
    if (type === "Trade") {
      const req = chattingAPI.postchatDirect(receiver, dealid);
      req
        .then((res) => {
          const chattingRoomId = res.data.result.directChattingRoomId;
          navigate(`/mychatroom/${chattingRoomId}`, {
            state: { dealid: dealId, chatId: chattingRoomId },
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (type === "Auction") {
      const req = AuctionAPI.getableAuction(dealId);
      req
        .then((res) => {
          console.log("경매하기 res", res.data.result);
          const result = res.data;
          const currBid = result.result.currentBid;
          const participantCnt = result.result.participantCount;
          const userName = result.result.userNickname;

          navigate(`/auction/${dealId}`, {
            state: {
              dealinfo: dealInfo,
              dealid: dealId,
              bidMoney: currBid,
              pplCnt: participantCnt,
              userNickName: userName,
            },
          });
        })
        // 참여할 수 없는 경매
        .catch((err) => {
          const errCode = err.response.data.code;
          if (errCode === "D400") {
            toast.error("아직 거래가 시작되지 않았어요!");
          } else if (errCode === "D500") {
            toast.error("이미 종료된 거래입니다!");
          }
        });
    } else if (type === "Sharing") {
      // 나눔신청하기
      const apply = dealAPI.postSharingApply(dealId);
      apply.then((res) => {
        console.log(res, "나눔이 신청되었습니다!");
        setIsModalOpen(true);
        setSharingNum(res.data.result);
      });
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal setModalOpen={setIsModalOpen}>
          {sharingNum === 0 ? (
            <>
              <h3>😥신청 실패😥</h3>
              <p>
                다음 나눔 때 다시 도전해주세요. <br /> 한정된 인원만 나눔을 받을
                수 있기에 <br /> 선착순으로 진행되는 점 양해부탁드립니다.
              </p>
            </>
          ) : (
            <>
              <h3>🎉신청 성공!🎉</h3>
              <p>
                한정된 인원만 선정된 만큼 <br />
                거래에 늦지 않게 참여해 주세요!
              </p>
              <p>당첨 번호</p>
              {/* <p>{sharingNum}</p> */}
            </>
          )}
        </Modal>
      )}
      {isChargeModalOpen && (
        <Modal setModalOpen={setIsChargeModalOpen}>
          <h1>😢 충전해주세요! 😢</h1>
          <p>보유금액이 부족해요..</p>
          <p>충전 후 다시 이용해주세요!</p>
          <Button
            color={typeInfo.color}
            onClick={() => {
              navigate("/payment");
            }}
          >
            충전하러 가기
          </Button>
        </Modal>
      )}
      <ToastContainer />
      <div className="deal-enter-button-component-container">
        {/* {typeInfo && (
          <Button color={typeInfo.color} onClick={dealClickHandler}>
            {typeInfo.content}
          </Button>
        )} */}
        {receiver === userInfo.nickname && dealInfo.dealType === "Trade" ? (
          <div className="no-enter-button">
            <p>나의 채팅 목록에서 구매자와 거래를 이어갈 수 있어요 ☺</p>
          </div>
        ) : receiver === userInfo.nickname &&
          dealInfo.dealType === "Sharing" ? (
          <div className="no-enter-button">
            <p>오픈 시간이 되면 신청자에게 선착순으로 번호표가 배부됩니다 💌</p>
          </div>
        ) : (
          <Button color={typeInfo.color} onClick={dealClickHandler}>
            {typeInfo.content}
          </Button>
        )}
      </div>
    </>
  );
}
