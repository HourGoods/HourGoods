import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@components/common/Button";
import { useRecoilState } from "recoil";
import { TicketIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { UserStateAtom } from "@recoils/user/Atom";

export default function index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
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
      approval_url: "http://localhost:3000/ticket",
      fail_url: "http://localhost:3000/mypage",
      cancel_url: "http://localhost:3000/mypage",
    },
  });

  const navigate = useNavigate();

  const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      params: {
        ...prevState.params,
        total_amount: Number(e.target.value),
      },
    }));
  };

  const [payUrl, setPayUrl] = useState("");

  // useEffect(() => {
  //   const { params } = state;
  //   axios({
  //     // 프록시에 카카오 도메인을 설정했으므로 결제 준비 url만 주자
  //     url: "https://kapi.kakao.com/v1/payment/ready",
  //     // 결제 준비 API는 POST 메소드라고 한다.
  //     method: "POST",
  //     headers: {
  //       // 카카오 developers에 등록한 admin키를 헤더에 줘야 한다.
  //       Authorization: "KakaoAK e74d46458f51e4d2bec823b97eb4255e",
  //       "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
  //     },
  //     // 설정한 매개변수들
  //     params,
  //   }).then((response) => {
  //     console.log(response, "응답");
  //     setPayUrl(response.data.next_redirect_pc_url);
  //     // 응답에서 필요한 data만 뽑는다.
  //     // const {
  //     //   data: { next_redirect_pc_url, tid },
  //     // } = response;

  //     // console.log(next_redirect_pc_url);
  //     // console.log(tid);
  //     // 응답 data로 state 갱신
  //     // setState({ next_redirect_pc_url, tid });
  //   });
  // });

  const charge = () => {
    const { params } = state;
    axios({
      // 프록시에 카카오 도메인을 설정했으므로 결제 준비 url만 주자
      url: "https://kapi.kakao.com/v1/payment/ready",
      // 결제 준비 API는 POST 메소드라고 한다.
      method: "POST",
      headers: {
        // 카카오 developers에 등록한 admin키를 헤더에 줘야 한다.
        Authorization: process.env.REACT_APP_KAKAO_PAYMENT_ADMIN_KEY,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      // 설정한 매개변수들
      params,
    })
      .then((response) => {
        console.log(response, "응답");
        // setPayUrl(response.data.next_redirect_pc_url);
        window.location.href = response.data.next_redirect_pc_url;
      })
      // 응답에서 필요한 data만 뽑는다.
      // const {
      //   data: { next_redirect_pc_url, tid },
      // } = response;

      // console.log(next_redirect_pc_url);
      // console.log(tid);
      // 응답 data로 state 갱신
      // setState({ next_redirect_pc_url, tid });
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
              userInfo.cash ? userInfo.cash : 0
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
