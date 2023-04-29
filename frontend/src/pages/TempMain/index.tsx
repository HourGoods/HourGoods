import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";

export default function index() {
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();

  const inputHandler = (e: any) => {
    setInputValue(e.target.value);
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (inputValue === "허예지" || inputValue === "8204") {
      navigate("/main");
      alert("환영합니다!");
    } else {
      alert("입력 코드가 틀렸습니다.");
    }
  };

  return (
    <div className="temp-main-page-container">
      <div className="temp-main-title-div">
        <h3>
          <span>단 하루 </span>열리는 우리만의 굿즈 거래 💝
        </h3>
        <h1>Hour Goods</h1>
      </div>
      <p>코드를 입력하고 사이트에 접속해보세요!</p>
      <form action="submit" onSubmit={submitHandler}>
        <input
          type="text"
          onChange={inputHandler}
          value={inputValue}
          placeholder="코드를 입력해 주세요"
        />
        <button type="submit">확인</button>
      </form>
    </div>
  );
}
