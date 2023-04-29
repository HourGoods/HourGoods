import React from "react";
import classNames from "classnames";
import "./index.scss";
import kakaoImg from "@assets/kakao.svg";

interface IBtnProps {
  children: React.ReactNode;
  color?: string;
  size?: string;
  onClick: any;
  isActive?: boolean;
}

export default function index({
  children,
  color,
  size,
  onClick,
  isActive,
}: IBtnProps) {
  const handleClick = (e: any) => onClick(e);
  let imgSrc = null;
  if (color === "kakao") {
    imgSrc = kakaoImg;
  }

  return (
    <button
      type="button"
      className={classNames(
        "commonButton",
        color,
        size,
        isActive && "activated"
      )}
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
