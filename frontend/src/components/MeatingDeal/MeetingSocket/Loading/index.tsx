/* eslint-disable react/react-in-jsx-scope */
import LoadingImg from "@assets/walkLoad.gif";

export default function index() {
  return (
    <div className="loading-container">
      <p>상대방 위치 불러오는 중...</p>
      <img src={LoadingImg} alt="로딩" />
    </div>
  );
}
