import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import "./index.scss";

export default function index() {
  return (
    <div className="search-bar-container">
      <MagnifyingGlassIcon />
      <input type="text" name="" id="" placeholder="검색하기"/>
      <button type="button">
        <p>확인</p>
      </button>
    </div>
  );
}
