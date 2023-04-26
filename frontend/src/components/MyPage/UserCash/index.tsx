import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRightIcon,
  CurrencyDollarIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";

export default function index() {
  return (
    <div className="usercash-container">
      <Link to="/">
        <button type="button" className="usercash-wrapper">
          <TicketIcon className="ticket-icon" />
          <p>티켓</p>
          <p>1,000,000원</p>
          <ChevronRightIcon className="chevron-right-icon" />
        </button>
      </Link>
      <Link to="/">
        <button type="button" className="usercash-wrapper">
          <CurrencyDollarIcon className="currnecy-dollar-icon" />
          <p>충전하기</p>
          <ChevronRightIcon className="chevron-right-icon" />
        </button>
      </Link>
    </div>
  );
}
