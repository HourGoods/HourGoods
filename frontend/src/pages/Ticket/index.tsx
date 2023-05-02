import React, { Component } from "react";
import "./index.scss";
import TicketBalance from "@components/Ticket/TicketBalance";
import TickCard from "@components/Ticket/TicketCard";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function index() {
  return (
    <div className="ticket-main-container">
      <div className="ticket-contents-container">
        <TicketBalance />
        <TickCard />
        <div>
          <button type="button" className="next-button">
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
