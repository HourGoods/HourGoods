import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRightIcon,
  CurrencyDollarIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";

export default function index() {
  return (
    <div className="ticket-container">
      <div className="link-decoration">
        <div className="ticket-wrapper">
          <div className="ticket">
            <TicketIcon className="ticket-icon" />
            <p className="ticket-tag">티켓</p>
          </div>
          <p className="cash">1,000,000원</p>
        </div>
      </div>
    </div>
  );
}
