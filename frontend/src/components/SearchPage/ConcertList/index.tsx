import React from "react";
import { ConcertInterface } from "@pages/Search";
import ConcertCard from "@components/common/ConcertCard";

interface IConcertProps {
  concertInfoList: ConcertInterface[];
  flag?: string;
}

export default function index(props: IConcertProps) {
  const { concertInfoList, flag } = props;
  return (
    <div>
      {concertInfoList.map((concert: ConcertInterface) => (
        <ConcertCard
          concertInfo={concert}
          key={concert.koPisConcertId}
          flag={flag}
        />
      ))}
    </div>
  );
}
