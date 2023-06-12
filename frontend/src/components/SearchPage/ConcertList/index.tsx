/* eslint-disable react/react-in-jsx-scope */
import { ConcertInterface } from "@interfaces/concert.interface";
import ConcertCard from "@components/common/ConcertCard";

interface IConcertProps {
  concertInfoList: ConcertInterface[];
  flag?: string;
}

export default function index(props: IConcertProps) {
  const { concertInfoList, flag } = props;
  return (
    <div className="card-list-container">
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
