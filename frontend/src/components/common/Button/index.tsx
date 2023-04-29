import React from "react";
import classNames from "classnames";
import "./index.scss";
import kakaoImg from "@assets/kakao.svg";

interface IBtnProps {
  children: React.ReactNode;
  color?: string;
  size?: string;
  onClick: any;
}

export default function index({ children, color, size, onClick }: IBtnProps) {
  const handleClick = (e: any) => onClick(e);
  let imgSrc = null;
  if (color === "kakao") {
    imgSrc = kakaoImg;
  }

  return (
    <button
      type="button"
      className={classNames("commonButton", color, size)}
      onClick={onClick && handleClick}
    >
      {imgSrc && <img src={imgSrc} alt="로고" />}
      <p>{children}</p>
    </button>
  );
}

index.defaultProps = {
  color: "dark-blue",
  size: "large",
  onClick: () => {
    return null;
  },
};
