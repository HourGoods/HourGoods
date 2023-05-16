import React from "react";
import Map from "@components/RealTime/Map/index";
import MeatingDeal from "@components/MeatingDeal";
import "./index.scss";

export default function index() {
  return (
    <div className="meeting-deal-main-contaienr">
      <div className="meeting-deal-overay">
        <div className="meeting-deal-box">
          {/* <Map /> */}
          <MeatingDeal />
        </div>
      </div>
    </div>
  );
}
