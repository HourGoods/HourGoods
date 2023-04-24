import React, { useEffect, useState } from "react";
import { getLocation } from "./getLocation";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map() {
  const [location, setLocation] = useState<
    { latitude: number; longitude: number } | string
  >("");

  useEffect(() => {
    getLocation().then((result) => {
      setLocation(result);
    });
  }, []);

  useEffect(() => {
    if (location && location !== "" && typeof location !== "string") {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
    }
  }, [location]);

  return (
    <div>
      <p>카카오</p>
      <div id="map" style={{ width: "500px", height: "400px" }} />
    </div>
  );
}