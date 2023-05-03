import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { dealState, searchModalState } from "@recoils/deal/Atoms";
import { searchResultConcertState } from "@recoils/concert/Atoms";
import Button from "@components/common/Button";
import Modal from "@components/common/Modal";
import ConcertCard from "@components/common/ConcertCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import SearchModalContent from "./SearchModalContent";

export interface ConcertInterface {
  imageUrl: string;
  kopisConcertId: string;
  place: string;
  startDate: string;
  title: string;
}

export type ConcertList = ConcertInterface[];

export default function index() {
  // Update할 Deal 정보
  const [dealInfo, setDealInfo] = useRecoilState(dealState);
  // 검색 모달을 위한 값
  const [modalOpen, setModalOpen] = useRecoilState(searchModalState);

  // 공연 정보가 선택된 경우 표시될 값
  const searchResultConcertInfo = useRecoilValue(searchResultConcertState);

  // Deal 타입 변화
  const [activeDealType, setActiveDealType] = useState({
    Trade: true,
    Sharing: false,
    Auction: false,
    HourAuction: false,
  });

  // State Update
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDealInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 검색
  const modalHandler = () => {
    setModalOpen(!modalOpen);
  };

  // Deal 타입 변화
  const activationHandler = (type: string) => {
    setActiveDealType((prev) => ({
      ...prev,
      Trade: type === "Trade",
      Sharing: type === "Sharing",
      Auction: type === "Auction",
      HourAuction: type === "HourAuction",
    }));
    setDealInfo((prev) => ({
      ...prev,
      dealType: type,
    }));
  };

  return (
    <>
      {modalOpen && (
        <Modal setModalOpen={setModalOpen}>
          <SearchModalContent />
        </Modal>
      )}
      <div className="deal-info-input-component-container">
        <div className="deal-type-buttons-container">
          <Button
            color="spink"
            size="deal"
            isActive={activeDealType.Trade}
            onClick={() => activationHandler("Trade")}
          >
            거래
          </Button>
          <Button
            color="syellow"
            size="deal"
            isActive={activeDealType.Sharing}
            onClick={() => activationHandler("Sharing")}
          >
            나눔
          </Button>
          <Button
            color="sindigo"
            size="deal"
            isActive={activeDealType.Auction}
            onClick={() => activationHandler("Auction")}
          >
            경매
          </Button>
          <Button
            color="spurple"
            size="deal"
            isActive={activeDealType.HourAuction}
            onClick={() => activationHandler("HourAuction")}
          >
            Hour경매
          </Button>
        </div>
        {/* ---------------------- 버튼 구분선 ---------------------- */}
        <input
          type="text"
          name="title"
          value={dealInfo.title}
          onChange={handleChange}
          className="deal-title-input"
          placeholder="Deal 제목을 입력해 주세요."
        />

        <div className="concert-search-button">
          <p>공연 정보</p>
          <button
            type="button"
            id="seacrh-concert-input"
            placeholder="검색하기"
            onClick={modalHandler}
          >
            검색하기
            <MagnifyingGlassIcon />
          </button>
        </div>
        {/* 검색 결과가 있다면 검색 결과 카드 표시 */}
        {dealInfo.concertId ? (
          <ConcertCard concertInfo={searchResultConcertInfo} />
        ) : null}

        <label htmlFor="concert-date-input">
          <p>오픈 일시</p>
          <input
            type="datetime-local"
            name="startTime"
            value={dealInfo.startTime}
            onChange={handleChange}
            id="concert-date-input"
          />
        </label>

        {/* ---------------- deal type에 따라 input값 변경 ---------------- */}

        {activeDealType.Trade && (
          <label htmlFor="HopePriceInput">
            <p>
              희망 거래 가격{" "}
              <span style={{ fontSize: "10px" }}>(단위: 원)</span>
            </p>
            <input
              type="number"
              name="price"
              value={dealInfo.price}
              onChange={handleChange}
              id="HopePriceInput"
            />
          </label>
        )}
        {activeDealType.Sharing && (
          <label htmlFor="SharedInput">
            <p>나눔 받을 인원</p>
            <input
              type="number"
              name="limit"
              value={dealInfo.limit}
              onChange={handleChange}
              id="SharedInput"
            />
          </label>
        )}
        {activeDealType.Auction || activeDealType.HourAuction ? (
          <>
            <label htmlFor="AuctionTimeInput">
              <p>종료 일시</p>
              <input
                type="datetime-local"
                name="endTime"
                value={dealInfo.endTime}
                onChange={handleChange}
                id="AuctionTimeInput"
              />
            </label>
            <label htmlFor="MinimumPriceInput">
              <p>
                경매 시작 가격{" "}
                <span style={{ fontSize: "10px" }}>(단위: 원)</span>
              </p>
              <input
                type="number"
                name="minimumPrice"
                value={dealInfo.minimumPrice}
                onChange={handleChange}
                id="MinimumPriceInput"
              />
            </label>
          </>
        ) : null}

        {/* ---------------- 공통 content ---------------- */}

        <label htmlFor="DealNoticeInput">
          <p>공지사항</p>
          <textarea
            id="DealNoticeInput"
            name="content"
            value={dealInfo.content}
            onChange={handleChange}
            placeholder="공지사항을 적어주세요"
          />
        </label>
      </div>
    </>
  );
}
