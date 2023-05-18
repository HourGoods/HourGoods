/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuctionAPI, chattingAPI } from "@api/apis";
import { useRecoilValue } from "recoil";
import {
  TrophyIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { UserStateAtom } from "@recoils/user/Atom";
import Button from "@components/common/Button";

export default function index(props: any) {
  const { isFinished, dealId, creator } = props;
  const [resultInfo, setResultInfo] = useState({
    bidAmount: 0,
    bidderCount: 0,
    isHost: false,
    isWinner: false,
    winnerAmount: 0,
    winnerNickname: "",
  });
  const navigate = useNavigate();
  const userInfo = useRecoilValue(UserStateAtom);

  useEffect(() => {
    AuctionAPI.getAuctionResult(dealId)
      .then((res) => {
        setResultInfo(res.data.result);
      })
      .catch((err) => {
        if (err.response.data.code === "B100") {
          alert("입찰 하지 않은 종료된 경매입니다. 마이페이지로 이동합니다.");
          navigate("/mypage");
        }
      });
  }, [isFinished]);

  const goHome = () => {
    navigate("/");
  };

  const personalChatting = () => {
    const receiver = creator;
    const req = chattingAPI.postchatDirect(receiver, dealId);
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
  };

  // 주최자일 때
  if (resultInfo.isHost) {
    return resultInfo.bidderCount === 0 || resultInfo.bidderCount === null ? (
      <div className="auction-result-contents-container">
        <h2>😥경매 참여자가 없습니다😥</h2>
        <p className="no-result-text-p">
          다음 경매에는 좋은 결과가 기다리고 있을 거에요!
        </p>
        <Button color="indigo" onClick={goHome}>
          메인으로 가기
        </Button>
      </div>
    ) : (
      <div className="auction-result-contents-container">
        <h2>🎊경매 결과🎊</h2>
        <hr />
        <div className="inline-texts-container">
          <div className="icon-text-wrapper">
            <UserGroupIcon />
            <p className="small-title-p">참여 인원</p>
          </div>
          <p>{resultInfo.bidderCount} 명</p>
        </div>
        <div className="inline-texts-container">
          <div className="icon-text-wrapper">
            <TicketIcon />
            <p className="small-title-p"> 낙찰가</p>
          </div>
          <p>{resultInfo.winnerAmount} 원</p>
        </div>
        <div className="inline-texts-container">
          <div className="icon-text-wrapper">
            <TrophyIcon />
            <p className="small-title-p">낙찰자</p>
          </div>
          <p>{resultInfo.winnerNickname}</p>
        </div>
      </div>
    );
  }
  // 주최자가 아닐 때
  return (
    <div className="auction-result-contents-container">
      <h2>🎉경매 결과🎉</h2>
      {resultInfo.isWinner && <h3>축하합니다! 입찰에 성공했습니다 😊</h3>}
      <hr />
      <div className="inline-texts-container">
        <div className="icon-text-wrapper">
          <UserGroupIcon />
          <p className="small-title-p">참여 인원</p>
        </div>
        <p>{resultInfo.bidderCount} 명</p>
      </div>
      <div className="inline-texts-container">
        <div className="icon-text-wrapper">
          <TicketIcon />
          <p className="small-title-p"> 낙찰가</p>
        </div>
        <p>{resultInfo.bidAmount} 원</p>
      </div>
      {resultInfo.isWinner && (
        <>
          <p className="result-heper-text-p">
            1:1 대화방에서 <br /> 경매 주최자와 거래를 이어갈 수 있습니다!
          </p>
          <Button color="pink" onClick={personalChatting}>
            1:1 대화하기
          </Button>
        </>
      )}
    </div>
  );
}
