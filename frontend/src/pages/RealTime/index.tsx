import React, { useState, useEffect } from "react";
import getCurrentLocation from "@utils/getCurrentLocation";
import Map from "@components/RealTime/Map/index";
import CardList from "@components/RealTime/CardList";
import { concertAPI } from "@api/apis";
import "./index.scss";

export default function index() {
  const [location, setLocation] = useState<
    { latitude: number; longitude: number } | string
  >("");
  const [flag, setFlag] = useState(false);
  const [concertList, setConcerList] = useState([]);

  useEffect(() => {
    getCurrentLocation()
      .then((response) => {
        if (typeof response === "string") {
          setLocation(response);
        } else {
          // api요청
          setLocation(response);
          concertAPI
            .getTodayConcert(response.latitude, response.longitude)
            .then((res) => {
              console.log(res, "api요청");
              setConcerList(res.data.result.concertInfoList);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="realtime-page-container">
      <Map
        concertList={concertList}
        flag={flag}
        setFlag={setFlag}
        location={location}
        setLocation={setLocation}
      />

      <CardList concertList={concertList} />
    </div>
  );
}
