/* eslint-disable react/react-in-jsx-scope */
import Routers from "@pages/Routers";
import "./App.scss";
import Nav from "@components/common/Nav";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <Nav />
        <Routers />
      </RecoilRoot>
    </div>
  );
}

export default App;
