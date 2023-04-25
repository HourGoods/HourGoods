import React from "react";
import { Link } from "react-router-dom";

export default function index() {
  return (
    <div className="UserCashBackground">
      <Link to="/">
        <button type="button">
          <img alt="티켓" />
          <p>티켓</p>
          <p>1,000,000원</p>
          <img alt=">" />
        </button>
      </Link>
      <Link to="/">
        <button type="button">
          <img alt="티켓" />
          <p>티켓</p>
          <p>1,000,000원</p>
          <img alt=">" />
        </button>
      </Link>
    </div>
  );
}
