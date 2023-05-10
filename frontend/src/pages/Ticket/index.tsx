/* eslint-disable react/no-array-index-key */
import React, { Component, useEffect } from "react";
import "./index.scss";
import TicketBalance from "@components/Ticket/TicketBalance";
import TickCard from "@components/Ticket/TicketCard";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";

export default function index() {
  const parms = useParams();
  useEffect(() => {
    console.log(parms);
  });
  const ticketlist = [
    {
      pointHistoryId: 1,
      description: "10점 충전",
      amount: 10,
      usageTime: "2023-05-06T23:14:11.407Z",
    },
    {
      pointHistoryId: 2,
      description: "20점 충전",
      amount: 20,
      usageTime: "2023-05-05T14:05:11.407Z",
    },
    {
      pointHistoryId: 3,
      description: "포인트 사용",
      amount: -5,
      usageTime: "2023-05-03T09:23:11.407Z",
    },
    {
      pointHistoryId: 4,
      description: "포인트 사용",
      amount: -3,
      usageTime: "2023-05-02T16:44:11.407Z",
    },
    {
      pointHistoryId: 5,
      description: "50점 충전",
      amount: 50,
      usageTime: "2023-05-01T10:07:11.407Z",
    },
  ];
  return (
    <div className="ticket-main-container">
      <div className="ticket-contents-container">
        <TicketBalance />
        {ticketlist.map((ticket, index) => (
          <TickCard ticket={ticket} key={index} />
        ))}
        <div>
          <button type="button" className="next-button">
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
