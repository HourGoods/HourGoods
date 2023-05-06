import React, { useEffect, useState } from "react";
import Button from "@components/common/Button";

export default function index(props: any) {
  const { dealType } = props;
  const [typeInfo, setTypeInfo] = useState({
    color: "",
    content: "",
  });

  useEffect(() => {
    if (dealType === "Auction" || dealType === "HourAuction") {
      setTypeInfo({
        color: "purple",
        content: "경매장 입장하기",
      });
    }
    if (dealType === "Sharing") {
      setTypeInfo({
        color: "yellow",
        content: "나눔 참여하기",
      });
    }
    if (dealType === "Trade") {
      setTypeInfo({
        color: "pink",
        content: "1:1 채팅하기",
      });
    }
  }, [dealType]);

  return (
    <div className="deal-enter-button-component-container">
      {typeInfo && <Button color={typeInfo.color}>{typeInfo.content}</Button>}
    </div>
  );
}
