// InputMsgBox.tsx
import React from "react";
import { ChatBubbleOvalLeftIcon, TicketIcon } from "@heroicons/react/24/solid";
import "./index.scss";

interface IInputProps {
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  onConfirm?: () => void;
}

export default function index({
  placeholder,
  value,
  onChange,
  type,
  onConfirm,
}: IInputProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="input-message-container">
      <div className="icon-message-wrapper">
        {type === "bid" ? <TicketIcon /> : <ChatBubbleOvalLeftIcon />}
        <input
          type={type === "bid" ? "number" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      <button type="button" onClick={handleConfirm}>
        확인
      </button>
    </div>
  );
}
