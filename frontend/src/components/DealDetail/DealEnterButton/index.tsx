import React, { useEffect, useState } from "react";
import Button from "@components/common/Button";
import { chattingAPI } from "@api/apis";
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
    }
    if (type === "Sharing") {
      setTypeInfo({
        color: "yellow",
        content: "나눔 참여하기",
      });
    }
    if (type === "Trade") {
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
          navigate(`/mychatroom/${chattingRoomId}`);
        })
        .catch((err) => {
          console.error(err);
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
