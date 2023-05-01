import React, { useState } from "react";
import ConcertCard from "@components/common/ConcertCard";
import Button from "@components/common/Button";
import SearchBar from "@components/common/SearchBar";
import DealCard from "@components/common/DealCard";
import "./index.scss";

export default function index() {
  const [activeDealType, setActiveDealType] = useState({
    all: true,
    trade: false,
    sharing: false,
    auction: false,
    hourAuction: false,
  });

  const activationHandler = (type: string) => {
    setActiveDealType((prev) => ({
      ...prev,
      all: type === "all",
      trade: type === "trade",
      sharing: type === "sharing",
      auction: type === "auction",
      hourAuction: type === "hourAuction",
    }));
  };
  return (
    <div className="concert-deal-page-container">
      <ConcertCard />

      <div className="deal-type-buttons-container">
        <Button
          color="spink"
          size="deal"
          isActive={activeDealType.all}
          onClick={() => activationHandler("all")}
        >
          전체보기
        </Button>
        <Button
          color="spink"
          size="deal"
          isActive={activeDealType.trade}
          onClick={() => activationHandler("trade")}
        >
          거래
        </Button>
        <Button
          color="syellow"
          size="deal"
          isActive={activeDealType.sharing}
          onClick={() => activationHandler("sharing")}
        >
          나눔
        </Button>
        <Button
          color="sindigo"
          size="deal"
          isActive={activeDealType.auction}
          onClick={() => activationHandler("auction")}
        >
          경매
        </Button>
        <Button
          color="spurple"
          size="deal"
          isActive={activeDealType.hourAuction}
          onClick={() => activationHandler("hourAuction")}
        >
          Hour경매
        </Button>
      </div>

      <SearchBar />

      <div>
        <DealCard />
        <DealCard />
        <DealCard />
        <DealCard />
        <DealCard />
      </div>
      <div className="create-deal-button-wrapper">
        <Button color="dark-blue">거래 생성하기</Button>
      </div>
    </div>
  );
}
