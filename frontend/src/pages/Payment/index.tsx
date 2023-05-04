import React from "react";
import Payment from "@components/Payment";

export default function index() {
  return (
    <div>
      <div className="ticket-main-container">
        <div className="ticket-contents-container">
          <Payment />
        </div>
      </div>
    </div>
  );
}
