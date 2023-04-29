// Main.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "@components/common/Modal";
import Button from "@components/common/Button";
import "./index.scss";

export default function Main() {
  const [modalOpen, setModalOpen] = useState(false);

  const modalClickHandler = () => {
    setModalOpen(true);
  };

  // const baseUrl = "https://k8a204.p.ssafy.io";
  const baseUrl = "http://localhost:3000";
  const loginUrl = `${baseUrl}/oauth2/authorization/kakao`;

  return (
    <div>
      <div>
        <h5>임시 가이드라인 정보</h5>
        <p>mobile: red</p>
        <p>tablet: green</p>
        <p>desktop: blue</p>
      </div>
    </div>
  );
}
