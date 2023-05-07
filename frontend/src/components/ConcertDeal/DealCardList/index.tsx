import React from "react";
import { DealInfoInterface } from "@pages/ConcertDeal";
import DealCard from "@components/common/DealCard";

interface IDealInfoProps {
  concertDealList: DealInfoInterface[];
}

export default function index(props: IDealInfoProps) {
  const { concertDealList } = props;

  return (
    <div>
      {concertDealList.map((deal: DealInfoInterface) => (
        <DealCard dealInfo={deal} key={deal.dealId} />
      ))}
    </div>
  );
}
