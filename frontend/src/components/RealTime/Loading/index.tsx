/* eslint-disable react/react-in-jsx-scope */
import LoadingImg from "@assets/walkLoad.gif";

export default function index() {
  return (
    <div className="common-modal-container">
      <div className="loading-modal-overlay">
        <div className="loading-modal-content-box">
          <p>범위 조정 중...</p>
          <img src={LoadingImg} alt="" />
        </div>
      </div>
    </div>
  );
}
