/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import meMarker from "@assets/userLocPoint.svg";
import youMarker from "@assets/otherUserLocPoint.svg";
import { dealAPI } from "@api/apis";
import Button from "@components/common/Button";
import { MeetingDealInfo } from "../index";

interface IMapPropsType {
  meetingInfo: MeetingDealInfo;
  userName: string;
  clientRef: any;
  tradeLocId: string;
  dealId: any;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map(props: IMapPropsType) {
  const { meetingInfo, userName, clientRef, tradeLocId, dealId } = props;
  const [map, setMap] = useState<any>(null);

  const [myLocation, setMyLocation] = useState({ latitude: 0, longitude: 0 });
  const [markers, setMarkers] = useState<any[]>([]);

  // 최초 map이 그려졌음을 표시하는 flag... 0: map만, 1: 최초지도, 2: 갱신상태
  const [flag, setFlag] = useState(0);

  // 딜 생성자 정보
  const [dealCreator, setDealCreator] = useState("");

  // 내 위치 전송 (messageType === "Location")
  const sendMyLocation = (long: number, lat: number) => {
    const message = {
      nickname: userName,
      longitude: long,
      latitude: lat,
      tradeLocationId: tradeLocId,
    };
    const destination = `/pub/meet/${dealId}`;
    const body = JSON.stringify(message);
    clientRef.current?.publish({ destination, body });
  };

  // 백에 거래종료를 알림 (messageType === "Done")
  const sendDoneMessage = () => {
    const message = {
      tradeLocationId: tradeLocId,
      nickname: userName,
    };
    const destination = `/pub/meet/${dealId}/done`;
    const body = JSON.stringify(message);
    clientRef.current?.publish({ destination, body });
  };

  // 버튼 클릭시 sendDoneMessage 실행합니다
  const finishDealHandler = () => {
    sendDoneMessage();
  };

  useEffect(() => {
    // 위치 정보를 가져오는 함수
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setMyLocation(position.coords);
          sendMyLocation(longitude, latitude);
        },
        (error) => {
          console.error("Failed to get current location:", error);
        }
      );
    };

    // 위치 정보 변경 시 sendMyLocation 함수 자동 호출
    const watchLocation = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setMyLocation(position.coords);
        sendMyLocation(longitude, latitude);
      },
      (error) => {
        console.error("Failed to watch location:", error);
      }
    );

    getLocation();

    // 컴포넌트가 언마운트될 때 위치 정보 변경 감시를 정리함
    return () => {
      navigator.geolocation.clearWatch(watchLocation);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(37.49483466037, 127.02871475306), // 기본 위치
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options);
    setMap(map);
    setFlag(1); // map이 그려진 상태라는 뜻

    // 생성자 정보 받아오는 api
    const result = dealAPI.getDealCreator(dealId);
    result.then((res) => {
      setDealCreator(res.data.result.nickname);
    });
  }, []);

  useEffect(() => {
    if (flag === 1 && map) {
      // 기존 마커들 제거
      markers.forEach((marker) => {
        marker.setMap(null);
      });

      // 마커 이미지
      const meMarkerImg = new window.kakao.maps.MarkerImage(
        meMarker, // 마커 이미지 URL
        new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
        {
          offset: new window.kakao.maps.Point(20, 40),
          alt: "내 위치",
        }
      );
      // 마커 이미지
      const youMarkerImg = new window.kakao.maps.MarkerImage(
        youMarker, // 마커 이미지 URL
        new window.kakao.maps.Size(40, 40), // 마커 이미지 크기
        {
          offset: new window.kakao.maps.Point(20, 40),
          alt: "상대 위치",
        }
      );

      // 새로운 마커들 생성 및 표시
      const positions = [
        {
          image: meMarkerImg,
          title: "내 위치",
          latlng: new window.kakao.maps.LatLng(
            myLocation.latitude,
            myLocation.longitude
          ),
        },
        {
          image: youMarkerImg,
          title: "상대방",
          latlng: new window.kakao.maps.LatLng(
            meetingInfo.otherLatitude,
            meetingInfo.otherLongitude
          ),
        },
      ];

      const newMarkers = positions.map((position) => {
        const markerOptions = {
          map,
          position: position.latlng,
          title: position.title,
          image: position.image,
        };

        const marker = new window.kakao.maps.Marker(markerOptions);
        return marker;
      });

      // 새로운 마커들을 상태에 업데이트
      setMarkers((prevMarkers) => {
        // 기존 마커들 제거
        prevMarkers.forEach((marker) => {
          marker.setMap(null);
        });

        // 이전 상태를 기반으로 새로운 상태 생성
        const updatedMarkers = [...newMarkers];
        return updatedMarkers;
      });

      // 맵 중심을 내 위치로 이동
      const { latitude, longitude } = myLocation;
      map.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
    }
  }, [myLocation, meetingInfo, flag, map]);

  return (
    <div className="map-main-container">
      <div className="map-top-container">
        <div className="deal-location-information-container">
          <h3>📍 실시간 위치</h3>
          <p>상대와의 거리: 약 {Math.ceil(meetingInfo.distance)}m</p>
        </div>
        {/* 상황별 표시 문구 */}
        <div className="deal-situational-contents-container">
          {meetingInfo.distance > 50 && (
            <p>※ 50m 이내에서 포인트 거래가 활성화 됩니다.</p>
          )}
          {dealCreator === userName && meetingInfo.distance <= 50 && (
            <p>※ 구매자가 물품 구매 수락 시 포인트 거래가 성사됩니다.</p>
          )}
          {dealCreator !== userName && meetingInfo.distance <= 50 && (
            <p>※ 물품을 구매하셨나요? 버튼을 누르면 포인트가 차감됩니다.</p>
          )}
        </div>
      </div>
      {/* 크기는 원하는대로 변경 가능! */}
      <div className="map-bottom-container">
        <div id="map" />
        <div className="loc-info-box">
          <span>
            <img src={meMarker} alt="나" />
          </span>
          내 위치 &nbsp; &nbsp;{" "}
          <span>
            <img src={youMarker} alt="나" />
          </span>{" "}
          상대 위치
        </div>
        {dealCreator !== userName && meetingInfo.distance <= 50 && (
          <div className="buy-button-box">
            <Button color="pink" onClick={finishDealHandler}>
              물품을 구매했어요
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
