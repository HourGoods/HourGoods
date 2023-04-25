import React from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import "./Nav.scss";

export default function Nav() {
  return (
    <header>
      <div>
        <button type="button">
          <Bars3Icon />
        </button>
        <h2>Nav Bar</h2>
      </div>
    </header>
  );
}
