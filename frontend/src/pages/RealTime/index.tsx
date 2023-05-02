import React from "react";
import Map from "@components/RealTime/Map/index";
import CardList from "@components/RealTime/CardList";
import "./index.scss";

export default function index() {
  return (
    <div className="realtime-page-container">
      <Map />
      <CardList />
    </div>
  );
}
