import React from "react";
import { useNavigate } from "react-router";
import Button from "@components/common/Button";

export default function index() {
  const navigate = useNavigate();

  const goMakeDeal = () => {
    navigate("/create/deal");
  };

  return (
    <div className="no-result-component-container">
      <div className="result-texts-container">
        <p>거래가 있는 공연이 존재하지 않아요!</p>
        <p>새로 생성하러 가볼까요?</p>
      </div>
      <div>
        <Button color="dark-blue" onClick={goMakeDeal}>
          거래 생성하기
        </Button>
      </div>
    </div>
  );
}