import React from "react";
import { ConcertInterface } from "@pages/Search";
import ConcertCard from "@components/common/ConcertCard";

interface IConcertProps {
  concertInfoList: ConcertInterface[];
  flag?: string;
}


export default function index(props: IConcertProps) {
  const { concertInfoList, flag } = props;
  console.log(concertInfoList[0].kopisConcertId, "와이라노")
  return (
    <div>
      {concertInfoList.map((concert: ConcertInterface) => (
        <ConcertCard
          concertInfo={concert}
          key={concert.kopisConcertId}
          flag={flag}
        />
      ))}
    </div>
  );
}
