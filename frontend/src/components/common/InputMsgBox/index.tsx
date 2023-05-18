// InputMsgBox.tsx
/* eslint-disable */
import {
  ChatBubbleOvalLeftIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import "./index.scss";

interface IInputProps {
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "bid" | "message";
  onConfirm?: () => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function InputMsgBox({
  placeholder,
  value,
  onChange,
  type,
  onConfirm,
  onKeyPress,
}: IInputProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  return (
    <div className="input-message-container">
      <div className="icon-message-wrapper">
        {type === "bid" ? <CurrencyDollarIcon /> : <ChatBubbleOvalLeftIcon />}
        <input
          type={type === "bid" ? "number" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <button type="button" onClick={handleConfirm}>
        확인
      </button>
    </div>
  );
}
