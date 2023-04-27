import React from "react";
import Routers from "@pages/Routers";
import "./App.scss";
import Nav from "@components/common/Nav";

function App() {
  return (
    <div className="App">
      <Nav />
      <Routers />
    </div>
  );
}

export default App;
