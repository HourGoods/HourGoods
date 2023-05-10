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
        <p>콘서트와 거래를 미리 볼 수 있어요!</p>
        <p>바로 거래를 생성하고 싶으면 <br /> 거래 생성하기 버튼을 눌러주세요</p>
      </div>
      <div>
        <Button color="dark-blue" onClick={goMakeDeal}>
          거래 생성하기
        </Button>
      </div>
    </div>
  );
}
