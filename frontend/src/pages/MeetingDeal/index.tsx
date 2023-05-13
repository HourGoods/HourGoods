import React from "react";
import Map from "@components/RealTime/Map/index";
import MeatingDeal from "@components/MeatingDeal";

export default function index() {
  return (
    <div>
      <h1>거래지도</h1>
      {/* <Map /> */}
      <MeatingDeal />
    </div>
  );
}
