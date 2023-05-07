import React from "react";
import Map from "@components/RealTime/Map/index";

export default function index() {
  return (
    <div>
      <h1>거래지도</h1>
      <Map />
      <p>상대방이 멀리 있어요!</p>
      <p>가까이 가세요!</p>
    </div>
  );
}
