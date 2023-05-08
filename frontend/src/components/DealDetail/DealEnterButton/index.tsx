import React, { useEffect, useState } from "react";
import Button from "@components/common/Button";
import { AuctionAPI, chattingAPI } from "@api/apis";
import { useNavigate } from "react-router-dom";

export default function index(props: any) {
  const { dealInfo, dealId } = props;
  const type = dealInfo.dealType;
  const receiver = dealInfo.userNickname;
  const dealid = dealId;
  const navigate = useNavigate();

  const [typeInfo, setTypeInfo] = useState({
    color: "",
    content: "",
  });

  useEffect(() => {
    if (type === "Auction" || type === "HourAuction") {
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

  const dealClickHandler = () => {
    // 1:1 채팅하기
    if (type === "Trade") {
      const req = chattingAPI.postchatDirect(receiver, dealid);
      req
        .then((res) => {
          console.log(res);
          const chattingRoomId = res.data.result;
          navigate(`/mychatroom/${chattingRoomId}`, {
            state: { dealinfo: dealInfo },
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (type === "Auction") {
      const req = AuctionAPI.getableAuction(dealId);
      req
        .then((res) => {
          const result = res.data;
          const currBid = result.result.currentBid;
          const participantCnt = result.result.participantCount;
          const userName = result.result.userNickname;

          console.log(currBid);
          console.log(participantCnt);
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
          const errCode = err.response.data.errorCode;
          if (errCode === "D400") {
            alert("아직 거래가 시작되지 않았어요!");
          } else if (errCode === "D500") {
            alert("이미 종료된 거래입니다!");
          }
        });
    }
  };

  return (
    <div className="deal-enter-button-component-container">
      {typeInfo && (
        <Button color={typeInfo.color} onClick={dealClickHandler}>
          {typeInfo.content}
        </Button>
      )}
    </div>
  );
}
