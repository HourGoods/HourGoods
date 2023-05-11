import React from "react";
import Payment from "@components/Payment";
import "./index.scss";

export default function index() {
  return (
    <div>
      <div className="payment-main-container">
        <div className="payment-contents-container">
          <Payment />
        </div>
      </div>
    </div>
  );
}
