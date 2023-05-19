import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { dealState, searchModalState } from "@recoils/deal/Atoms";
import { concertDetailState } from "@recoils/concert/Atoms";
import { concertAPI } from "@api/apis";
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
  const param = useParams();

  // Update할 Deal 정보
  const [dealInfo, setDealInfo] = useRecoilState(dealState);
  // 검색 모달을 위한 값
  const [modalOpen, setModalOpen] = useRecoilState(searchModalState);
  // 공연 Detail
  const [concertDetailInfo, setConcertDetailInfo] =
    useRecoilState(concertDetailState);

  useEffect(() => {
    // 콘서트가 선택되어 넘어온 경우 deaInfo에 아이디 추가
    if (param.concertId) {
      const concertId = parseInt(param.concertId, 10);
      // concertDetail get요청
      concertAPI.getConcertDetail(concertId).then((res) => {
        const getInfo = res.data.result;
        setConcertDetailInfo(getInfo);
      });
    }
  }, []);

  // 콘서트 정보 업데이트 되면 작성 기본 값 세팅해주기
  useEffect(() => {
    setDealInfo((prev) => ({
      ...prev,
      concertId: concertDetailInfo.concertId,
      startTime: concertDetailInfo.startTime,
      latitude: concertDetailInfo.latitude,
      longitude: concertDetailInfo.longitude,
    }));
  }, [concertDetailInfo]);

  // Deal 타입 변화
  const [activeDealType, setActiveDealType] = useState({
    Trade: true,
    Sharing: false,
    Auction: false,
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
            color="Trade"
            size="deal"
            isActive={activeDealType.Trade}
            onClick={() => activationHandler("Trade")}
          />
          <Button
            color="Sharing"
            size="deal"
            isActive={activeDealType.Sharing}
            onClick={() => activationHandler("Sharing")}
          />

          <Button
            color="Auction"
            size="deal"
            isActive={activeDealType.Auction}
            onClick={() => activationHandler("Auction")}
          />
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
          <ConcertCard concertInfo={concertDetailInfo} />
        ) : null}

        <label htmlFor="concert-date-input">
          {activeDealType.Sharing ? (
            <>
              <p className="helper-text-top-p">신청 시작 시간</p>
              <p className="helper-text-p">
                ※ 나눔 신청 시간에 선착순 신청이 오픈됩니다. 실제 나눔 진행
                시간이 상이할 경우 공지사항에 작성해 주세요.
              </p>
            </>
          ) : (
            <>
              <p className="helper-text-top-p">오픈 일시</p>
              <p className="helper-text-p">
                ※ 해당 시간부터 거래장이 활성화 됩니다.
              </p>
            </>
          )}

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
              value={dealInfo.price || ""}
              onChange={handleChange}
              id="HopePriceInput"
              placeholder="금액을 입력해 주세요"
            />
          </label>
        )}
        {activeDealType.Sharing && (
          <label htmlFor="SharedInput">
            <p>나눔 받을 인원</p>
            <input
              type="number"
              name="limit"
              value={dealInfo.limit || ""}
              onChange={handleChange}
              id="SharedInput"
              placeholder="1명 이상 작성해주세요"
            />
          </label>
        )}
        {activeDealType.Auction ? (
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
                value={dealInfo.minimumPrice || ""}
                onChange={handleChange}
                id="MinimumPriceInput"
                placeholder="입력한 금액부터 입찰할 수 있습니다"
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
            maxLength={250}
            placeholder="공지사항을 적어주세요"
          />
        </label>
      </div>
    </>
  );
}
