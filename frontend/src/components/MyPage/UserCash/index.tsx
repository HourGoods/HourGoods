import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRightIcon,
  CurrencyDollarIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";

export default function index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);

  return (
    <div className="usercash-container">
      <Link to="/ticket" className="link-decoration">
        <button type="button" className="usercash-wrapper">
          <div className="ticket">
            <TicketIcon className="ticket-icon" />
            <p className="ticket-tag">티켓</p>
          </div>
          <div className="cash-box">
            <p className="cash">{`${userInfo.cash ? userInfo.cash : 0}원`}</p>
            <ChevronRightIcon className="chevron-right-icon" />
          </div>
        </button>
      </Link>
      <Link to="/payment" className="link-decoration">
        <button type="button" className="usercash-wrapper">
          <div className="charge">
            <CurrencyDollarIcon className="currnecy-dollar-icon" />
            <p className="dollar-tag">충전하기</p>
          </div>
          <ChevronRightIcon className="chevron-right-icon" />
        </button>
      </Link>
    </div>
  );
}
