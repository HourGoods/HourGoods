import React from "react";
import { ChatBubbleOvalLeftIcon, TicketIcon } from "@heroicons/react/24/solid";
import "./index.scss";

interface IInputProps {
  onClick?: any;
  type: string;
}

export default function index({ type, onClick }: IInputProps) {
  const handleInput = (e: any) => onClick(e);

  let txt = "";
  if (type === "bid") {
    txt = "경매가를 입력해주세요.";
  } else if (type === "msg") {
    txt = "메세지를 입력해주세요.";
  }
  return (
    <div className="input-message-container">
      <div className="icon-message-wrapper">
        {type === "bid" ? <TicketIcon /> : <ChatBubbleOvalLeftIcon />}
        <input placeholder={txt} />
      </div>
      <button type="button" onClick={onClick && handleInput}>
        확인
      </button>
    </div>
  );
}
