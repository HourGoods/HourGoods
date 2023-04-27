import React from "react";
import classNames from "classnames";
import "./index.scss";

interface BtnProps {
  text: string;
  color?: string;
  onClick: any;
}

export default function index({ text, color, onClick }: BtnProps) {
  const handleClick = (e: any) => onClick(e);
  return (
    <button
      type="button"
      className={classNames("commonButton", color)}
      onClick={onClick && handleClick}
    >
      <p>{text}</p>
    </button>
  );
}

index.defaultProps = {
  text: "버튼",
  color: "dark-blue;",
  onClick: () => {
    return null;
  },
};
