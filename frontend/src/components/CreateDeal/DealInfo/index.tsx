import React, { useState } from "react";

export default function index() {
  const [activeDealType, setActiveDealType] = useState({
    trade: true,
    sharing: false,
    auction: false,
    hourAuction: false,
  });
  return (
    <div className="deal-info-input-component-container">
      <div className="deal-type-buttons-container">
        <button type="button">거래</button>
        <button type="button">나눔</button>
        <button type="button">경매</button>
        <button type="button">Hour경매</button>
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
      {activeDealType.auction ||
        (activeDealType.hourAuction && (
          <label htmlFor="AuctionTimeInput">
            <p>경매 지속 시간</p>
            <input type="time" id="AuctionTimeInput" />
          </label>
        ))}

      <label htmlFor="DealNoticeInput">
        <p>공지사항</p>
        <textarea id="DealNoticeInput" placeholder="공지사항을 적어주세요" />
      </label>
    </div>
  );
}
