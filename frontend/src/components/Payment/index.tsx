import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@components/common/Button";
import { useRecoilState } from "recoil";
import { TicketIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { UserStateAtom } from "@recoils/user/Atom";

export default function index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  const [nextRedirectPcUrl, setNextRedirectPcUrl] = useState("");
  const [tid, setTid] = useState("");
  const [state, setState] = useState({
    // 응답에서 가져올 값들
    next_redirect_pc_url: "",
    tid: "",
    // 요청에 넘겨줄 매개변수들
    params: {
      cid: "TC0ONETIME",
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      item_name: "포인트 충전",
      quantity: 1,
      total_amount: 0,
      vat_amount: 200,
      tax_free_amount: 0,
      approval_url: "http://localhost:3000/payresult",
      fail_url: "http://localhost:3000/mypage",
      cancel_url: "http://localhost:3000/mypage",
    },
  });

  const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      params: {
        ...prevState.params,
        total_amount: Number(e.target.value),
      },
    }));
  };

  const charge = () => {
    const { params } = state;
    axios({
      // 프록시에 카카오 도메인을 설정했으므로 결제 준비 url만 주자
      url: "https://kapi.kakao.com/v1/payment/ready",
      // 결제 준비 API는 POST 메소드라고 한다.
      method: "POST",
      headers: {
        // 카카오 developers에 등록한 admin키를 헤더에 줘야 한다.
        Authorization: "KakaoAK e74d46458f51e4d2bec823b97eb4255e",
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      // 설정한 매개변수들
      params,
    })
      .then((response) => {
        const {
          data: { nextRedirectPcUrl, tid },
        } = response;
        console.log(nextRedirectPcUrl);
        console.log(tid);
        window.localStorage.setItem("tid", tid);
        setNextRedirectPcUrl(nextRedirectPcUrl);
        setTid(tid);
        window.location.href = response.data.next_redirect_pc_url;
      })

      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="payment-container">
        <div className="div-decoration">
          <div className="payment-wrapper">
            <div className="point">
              <TicketIcon className="point-icon" />
              <p className="point-tag">포인트</p>
            </div>
            <p className="point-cash">{`${
              userInfo.cash ? userInfo.cash.toLocaleString() : 0
            }원`}</p>
          </div>
        </div>
      </div>
      <div className="payment-container">
        <div className="div-decoration">
          <div className="payment-wrapper">
            <div className="charge">
              <ArrowsUpDownIcon className="charge-icon" />
              <p className="charge-tag">충전 금액</p>
            </div>
            <input
              className="charge-cash"
              type="number"
              min="0"
              max="1000000"
              placeholder="충전 금액을 입력해주세요."
              onChange={handleCashChange}
            />
          </div>
        </div>
      </div>
      <div className="buttondiv">
        <Button color="yellow" onClick={charge}>
          결제링크
        </Button>
      </div>
    </div>
  );
}
