import React, { useEffect, useState } from "react";
import { chattingAPI, dealAPI, meetingDealAPI } from "@api/apis";
import { useRecoilValue } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";
import { useLocation } from "react-router-dom";
import MeetingSocket from "./MeetingSocket";

export default function index() {
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname; // 내이름
  const location = useLocation();
  const dealId = location.state.dealid;
  const [sellerName, setSellerName] = useState(""); // deal에 등록된 이름
  const notMeName = location.state.otherUsername; // 니이름
  const [purchaserName, setPurchaserName] = useState("");
  const [tradeLocationId, setTradeLocationId] = useState("");

  useEffect(() => {
    console.log("만나서 거래하기 state값", location.state);
    const fetchData = async () => {
      try {
        const res = await dealAPI.getDealDeatail(dealId);
        setSellerName(res.data.result.userNickname);
        // 내가 판매자가 아니면 내가 구매자
        if (userName !== sellerName) {
          setPurchaserName(userName);
          // 내가 판매자면 너가 구매자
        } else {
          setPurchaserName(notMeName);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("판매자와 구매자", sellerName, purchaserName);
    const postData = async () => {
      try {
        if (sellerName && purchaserName) {
          const res = await meetingDealAPI.postlocationInfo(
            dealId,
            sellerName,
            purchaserName
          );
          console.log(res.data.result); // 반환받은 tradeLocationId
          setTradeLocationId(res.data.result);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    postData();
  }, [sellerName, purchaserName, dealId]);

  return (
    <div>
      <MeetingSocket tradeLocId={tradeLocationId} />
    </div>
  );
}
