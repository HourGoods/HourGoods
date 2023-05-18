import React, { useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { mypageAPI } from "@api/apis";

interface IProps {
  ticket: {
    pointHistoryId: number;
    description: string;
    amount: number;
    usageTime: string;
  };
}
export default function index({ ticket }: IProps) {
  const usageTime = new Date(ticket.usageTime);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - usageTime.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const startTime = new Date(ticket.usageTime);
  const year = String(startTime.getFullYear()).slice(-2);
  const month = String(startTime.getMonth() + 1).padStart(2, "0");
  const day = String(startTime.getDate()).padStart(2, "0");

  return (
    <div className="ticketcard-container" key={ticket.pointHistoryId}>
      <div className="div-decoration">
        <div className="ticketcard-day-wrapper">
          {diffDays === 1 ? (
            <p className="ticketcard-day-p">{`${year}.${month}.${day} (오늘)`}</p>
          ) : (
            <p className="ticketcard-day-p">{`${year}.${month}.${day} (${diffDays}일전)`}</p>
          )}
        </div>
        <div className="ticketcard-detail-wrapper">
          <p className="detail-title">{ticket.description}</p>
          {/* <p className="cash">{`${ticket.amount.toLocaleString()}원`}</p> */}
          <p
            className={`cash ${ticket.amount < 0 ? "minus" : ""}`}
            // >{`${ticket.amount.toLocaleString()}원`}</p>
          >
            {`${
              ticket.amount > 0 ? "+" : ""
            }${ticket.amount.toLocaleString()}원`}
          </p>
        </div>
      </div>
    </div>
  );
}
