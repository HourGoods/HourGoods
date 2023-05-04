import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import bgStars from "@assets/BGstars.svg";
import Auction from "@components/Auction";
import "./index.scss";

export default function index() {
  const location = useLocation();

  useEffect(() => {
    const bgColor =
      "linear-gradient(to bottom right, rgba(17,24,39, 1), rgba(49, 46, 129, 1))";
    const bgImage = `url(${bgStars})`;
    document.body.style.background = `${bgImage}, ${bgColor}`;

    return () => {
      document.body.style.background = "";
    };
  }, [location]);
  return (
    <div>
      <Auction />
    </div>
  );
}
