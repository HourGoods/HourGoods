/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from "react";
import PrivateChat from "@components/MyChatRoom/PrivateChat";
import { useLocation, useNavigate } from "react-router-dom";
import bgStars from "@assets/BGstars.svg";

export default function index() {
  const navigate = useNavigate();
  const location = useLocation();
  const dealId = location.state.dealid;

  useEffect(() => {
    const bgColor =
      "linear-gradient(to bottom right, rgba(17,24,39, 1), rgba(49, 46, 129, 1))";
    const bgImage = `url(${bgStars})`;
    document.body.style.background = `${bgImage}, ${bgColor}`;
    console.log(dealId);
    return () => {
      document.body.style.background = "";
    };
  }, [location]);

  return (
    <div className="private-chat-main-container">
      <div className="private-chat-modal-overay">
        <div className="private-chat-modal-box">
          <PrivateChat />
        </div>
      </div>
    </div>
  );
}
