import React, { useState } from "react";
import Button from "@components/common/Button";

export default function index() {
  const [activeDealType, setActiveDealType] = useState({
    trade: true,
    sharing: false,
    auction: false,
    hourAuction: false,
  });

  const activationHandler = (type: string) => {
    setActiveDealType((prev) => ({
      ...prev,
      trade: type === "trade",
      sharing: type === "sharing",
      auction: type === "auction",
      hourAuction: type === "hourAuction",
    }));
  };

  return (
    <div className="deal-info-input-component-container">
      <div className="deal-type-buttons-container">
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
      <input
        type="text"
        className="deal-title-input"
        placeholder="제목을 입력해 주세요."
      />
      <label htmlFor="seacrh-concert-input">
        <p>공연정보</p>
        <input type="text" id="seacrh-concert-input" placeholder="검색하기" />
      </label>
      <label htmlFor="concert-date-input">
        <p>날짜</p>
        <input type="date" id="concert-date-input" />
      </label>
      <label htmlFor="deal-time-input">
        <p>시간</p>
        <input type="time" id="deal-time-input" />
      </label>

      {/* deal type에 따라 input값 변경 */}

      {activeDealType.trade && (
        <label htmlFor="AuctionTimeInput">
          <p>희망 거래 가격</p>
          <input type="text" id="AuctionTimeInput" />
        </label>
      )}
      {activeDealType.sharing && (
        <label htmlFor="AuctionTimeInput">
          <p>나눔 받을 인원</p>
          <input type="text" id="AuctionTimeInput" />
        </label>
      )}
      {activeDealType.auction || activeDealType.hourAuction ? (
        <label htmlFor="AuctionTimeInput">
          <p>경매 지속 시간</p>
          <input type="time" id="AuctionTimeInput" />
        </label>
      ) : null}

      <label htmlFor="DealNoticeInput">
        <p>공지사항</p>
        <textarea id="DealNoticeInput" placeholder="공지사항을 적어주세요" />
      </label>
    </div>
  );
}
