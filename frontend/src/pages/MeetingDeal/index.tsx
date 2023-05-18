/* eslint-disable react/react-in-jsx-scope */
import MeatingDeal from "@components/MeatingDeal";
import "./index.scss";

export default function index() {
  return (
    <div className="meeting-deal-main-contaienr">
      <div className="meeting-deal-overay">
        <div className="meeting-deal-box">
          <MeatingDeal />
        </div>
      </div>
    </div>
  );
}
