import React, { useEffect, useState } from "react";
import { chattingAPI, dealAPI, meetingDealAPI } from "@api/apis";
import { useRecoilValue } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";
import { useLocation } from "react-router-dom";
import getCurrentLocation from "@utils/getCurrentLocation";
import MeetingSocket from "./MeetingSocket";
import Map from "./Map";
import Loading from "./Loading";

export interface IMapProps {
  tradeLocationId: string;
  dealId?: number;
  sellerNickname: string;
  sellerLongitude: number;
  sellerLatitude: number;
  purchaserNickname: string;
  purchaserLongitude: number;
  purchaserLatitude: number;
  distance: number;
}

export default function index() {
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname; // 내이름
  const location = useLocation();
  const dealId = location.state.dealid;
  const [sellerName, setSellerName] = useState(""); // deal에 등록된 이름
  const notMeName = location.state.otherUsername; // 니이름
  const [purchaserName, setPurchaserName] = useState("");
  const [tradeLocationId, setTradeLocationId] = useState("");

  // 다솜: Map을 위한 props 입니다
  const [mapPropsState, setMapPropsState] = useState<IMapProps>({
    tradeLocationId: "",
    dealId: 0,
    sellerNickname: "",
    sellerLatitude: 37.476710536806,
    sellerLongitude: 126.96372209072,
    purchaserNickname: "",
    purchaserLatitude: 37.4731805,
    purchaserLongitude: 126.9613388,
    distance: 0,
  });

  useEffect(() => {
    console.log("만나서 거래하기 state값", location.state);
    const fetchData = async () => {
      try {
        const res = await dealAPI.getDealDeatail(dealId);
        setSellerName(res.data.result.userNickname);
        // 내가 판매자가 아니면 내가 구매자
        if (userName !== sellerName) {
          setPurchaserName(userName);
          setMapPropsState((prev: any) => ({
            ...prev,
            purchaserNickname: userName,
          }));
          // 내가 판매자면 너가 구매자
        } else {
          setPurchaserName(notMeName);
          setMapPropsState((prev: any) => ({
            ...prev,
            sellerNickname: userName,
          }));
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

          // 다솜: 여기서 반환 받은 locID를 활용해서 바로 내 위치 값을 쏘면 될 것 같아요
          /* 
          동현이가 적어준 2번 부분에 해당! * send: pub/meet/${dealId}
              {
                "tradeLocationId": aaabbbccc
                "nickname": 규연,
                "longitude": 128.1,
                "latitude": 37.1
              }
           */
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
      {/* 상대방과 나 모두 위치 정보가 왔을 때만 Map을 보여줍니다! */}
      <Loading />
      <Map mapPropsState={mapPropsState} userName={userName} />
    </div>
  );
}
