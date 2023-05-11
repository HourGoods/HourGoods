/* eslint-disable react/no-array-index-key */
import React, { Component, useEffect, useState } from "react";
import "./index.scss";
import TicketBalance from "@components/Ticket/TicketBalance";
import TickCard from "@components/Ticket/TicketCard";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import { mypageAPI } from "@api/apis";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";

export default function index() {
  const [ticketlist, setTicketlist] = useState([]);
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);

  useEffect(() => {
    mypageAPI
      .pointHistory(-1)
      .then((res) => {
        console.log(res);
        setTicketlist(res.data.result.pointHistoryInfoList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    mypageAPI
      .userinfo()
      .then((res) => {
        setUserInfo((prevUserInfo: any) => ({
          ...prevUserInfo,
          nickname: res.data.result.nickname,
          imageUrl: res.data.result.imageUrl,
          cash: res.data.result.cashPoint,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="ticket-main-container">
      <div className="ticket-contents-container">
        <TicketBalance />
        {ticketlist.map((ticket, index) => (
          <TickCard ticket={ticket} key={index} />
        ))}
        <div>
          <button type="button" className="next-button">
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
