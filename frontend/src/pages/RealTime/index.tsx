import React from "react";
import Map from "@components/RealTime/Map";
import CardList from "@components/RealTime/CardList";

export default function index() {
  return (
    <div>
      <p>실시간 페이지 입니다</p>
      <Map />
      <CardList />
    </div>
  );
}
