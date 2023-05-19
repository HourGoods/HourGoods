/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { dealAPI } from "@api/apis";
import { DealInfoInterface } from "@pages/ConcertDeal";
import { MapPinIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";

interface DealCardProps {
  dealInfo: DealInfoInterface;
}

export default function index({ dealInfo }: DealCardProps) {
  // 들어오는 값에 따라 변하는 내용
  const [dealCardTimeInfo, setDealCardTimeInfo] = useState({
    startDate: "",
    timeInfo: "",
  });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const goDetail = () => {
    navigate(`/deal/detail/${dealInfo.dealId}`);
  };

  const [typeName, setTypeName] = useState("");

  useEffect(() => {
    // 북마크 정보
    setIsBookmarked(dealInfo.isBookmarked);
    // 시간정보
    const date = dealInfo.startTime.split("T")[0];
    const hour = dealInfo.startTime.split("T")[1];

    if (
      dealInfo.dealTypeName === "Trade" ||
      dealInfo.dealTypeName === "Sharing"
    ) {
      setDealCardTimeInfo({
        startDate: date,
        timeInfo: hour,
      });
    }
    // Auction일 경우 경매지속시간 계산
    if (dealInfo.endTime) {
      const end = dealInfo.endTime.split("T")[1];
      setDealCardTimeInfo({
        startDate: date,
        timeInfo: `${hour}~${end}`,
      });
    }

    if (dealInfo.dealTypeName === "Trade") {
      setTypeName("거래");
    }
    if (dealInfo.dealTypeName === "Auction") {
      setTypeName("경매");
    }
  }, [dealInfo]);

  // bookmark API
  const bookmarkHanlder = () => {
    // 우선 로그인한 회원인지 판별
    const isLogin = localStorage.getItem("isLogin");

    if (!isLogin) {
      toast.info("로그인 시 이용할 수 있습니다!", {
        autoClose: 2000,
      });
    } else if (!isBookmarked && isLogin) {
      const result = dealAPI.postBookmark(dealInfo.dealId);
      result.then((res) => {
        setIsBookmarked(true);
        toast.success("북마크 성공 👌", {
          autoClose: 2000,
        });
      });
    }
    // 아니면 제거 api
    else if (isBookmarked && isLogin) {
      const result = dealAPI.deleteBookmark(dealInfo.dealId);
      result.then((res) => {
        setIsBookmarked(false);
        toast.success("북마크 해제 👌", {
          autoClose: 2000,
        });
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="small-deal-card-component-container">
        <button
          className="small-deal-card-left-contents-container"
          type="button"
          onClick={goDetail}
        >
          <div className="small-deal-card-left-img-wrapper">
            {dealInfo.imageUrl && dealInfo.imageUrl !== "" ? (
              <img
                src={`https://d2uxndkqa5kutx.cloudfront.net/${dealInfo.imageUrl}`}
                alt="물품사진"
              />
            ) : null}
          </div>
          <div className="small-deal-card-right-contents-container">
            <div className="small-deal-card-top-container">
              <p className="small-deal-title-p">
                [{typeName}] {dealInfo.title}
              </p>
            </div>
            <div className="small-deal-card-bottom-container">
              <div className="card-icon-text-div">
                <CalendarIcon />
                <p>{dealCardTimeInfo.startDate}</p>
              </div>
              <div className="card-icon-text-div">
                <ClockIcon />
                <p>{dealCardTimeInfo.timeInfo}</p>
              </div>
              <div className="card-icon-text-div">
                <MapPinIcon />
                <p>{dealInfo.meetingLocation}</p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </>
  );
}
