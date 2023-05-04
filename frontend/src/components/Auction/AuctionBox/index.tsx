import React from "react";
import AuctionDealCard from "./AuctionDealCard";
import RealtimeBidCard from "./RealtimeBidCard";

export default function index() {
  return (
    <div className="auctionbox-all-conatiner">
      <AuctionDealCard />
      <RealtimeBidCard />
    </div>
  );
}
