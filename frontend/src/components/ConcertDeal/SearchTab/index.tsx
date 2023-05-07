import React, { useState } from "react";
import { concertAPI } from "@api/apis";
import { useRecoilValue } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";
import Button from "@components/common/Button";
import SearchBar from "@components/common/SearchBar";

export default function index(props: any) {
  const { concertId, setConcertDealList } = props;
  const [activeDealType, setActiveDealType] = useState({
    All: true,
    Trade: false,
    Sharing: false,
    Auction: false,
    HourAuction: false,
  });
  const [searchInput, setSearchInput] = useState("");
  const userInfo = useRecoilValue(UserStateAtom);

  const activationHandler = (type: string) => {
    setActiveDealType((prev: any) => ({
      ...prev,
      All: type === "All",
      Trade: type === "Trade",
      Sharing: type === "Sharing",
      Auction: type === "Auction",
      HourAuction: type === "HourAuction",
    }));

    // api
    const result = concertAPI.getConcertDealList(
      concertId,
      -1,
      type,
      "",
      userInfo.nickname
    );
    result.then((res) => {
      console.log("콘서트별 딜 정보", res);
      setConcertDealList(res.data.result.dealInfoList);
    });
  };

  const searchHanler = () => {
    // api
    const result = concertAPI.getConcertDealList(
      concertId,
      -1,
      "All",
      searchInput,
      userInfo.nickname
    );
    result.then((res) => {
      console.log("콘서트별 딜 정보", res);
      setConcertDealList(res.data.result.dealInfoList);
    });
  };

  return (
    <div>
      <div className="deal-type-buttons-container">
        <Button
          color="All"
          size="deal"
          isActive={activeDealType.All}
          onClick={() => activationHandler("All")}
        />
        <Button
          color="Trade"
          size="deal"
          isActive={activeDealType.Trade}
          onClick={() => activationHandler("Trade")}
        />

        <Button
          color="Sharing"
          size="deal"
          isActive={activeDealType.Sharing}
          onClick={() => activationHandler("Sharing")}
        />

        <Button
          color="Auction"
          size="deal"
          isActive={activeDealType.Auction}
          onClick={() => activationHandler("Auction")}
        />

        <Button
          color="HourAuction"
          size="deal"
          isActive={activeDealType.HourAuction}
          onClick={() => activationHandler("HourAuction")}
        />
      </div>

      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSubmit={searchHanler}
      />
    </div>
  );
}
