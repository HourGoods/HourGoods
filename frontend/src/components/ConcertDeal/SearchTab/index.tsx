import React, { useState } from "react";
import Button from "@components/common/Button";
import SearchBar from "@components/common/SearchBar";

export default function index() {
  const [activeDealType, setActiveDealType] = useState({
    all: true,
    trade: false,
    sharing: false,
    auction: false,
    hourAuction: false,
  });

  const activationHandler = (type: string) => {
    setActiveDealType((prev: any) => ({
      ...prev,
      all: type === "all",
      trade: type === "trade",
      sharing: type === "sharing",
      auction: type === "auction",
      hourAuction: type === "hourAuction",
    }));
  };
  return (
    <div>
      <div className="deal-type-buttons-container">
        <Button
          color="All"
          size="deal"
          isActive={activeDealType.all}
          onClick={() => activationHandler("all")}
        />
        <Button
          color="Trade"
          size="deal"
          isActive={activeDealType.trade}
          onClick={() => activationHandler("trade")}
        />

        <Button
          color="Sharing"
          size="deal"
          isActive={activeDealType.sharing}
          onClick={() => activationHandler("sharing")}
        />

        <Button
          color="Auction"
          size="deal"
          isActive={activeDealType.auction}
          onClick={() => activationHandler("auction")}
        />

        <Button
          color="HourAuction"
          size="deal"
          isActive={activeDealType.hourAuction}
          onClick={() => activationHandler("hourAuction")}
        />
      </div>

      <SearchBar />
    </div>
  );
}
