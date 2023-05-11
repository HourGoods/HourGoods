import React from "react";
import { Link } from "react-router-dom";
import { TicketIcon } from "@heroicons/react/24/solid";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";

export default function index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  return (
    <div className="ticket-container">
      <div className="link-decoration">
        <div className="ticket-wrapper">
          <div className="ticket">
            <TicketIcon className="ticket-icon" />
            <p className="ticket-tag">티켓</p>
          </div>
          <p className="cash">{`${userInfo.cash ? userInfo.cash : 0}원`}</p>
        </div>
      </div>
    </div>
  );
}
