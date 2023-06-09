import React, { useState } from "react";
import axios from "axios";
import Button from "@components/common/Button";
import { useRecoilState } from "recoil";
import { TicketIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { UserStateAtom } from "@recoils/user/Atom";
import { isMobileDevice } from "@utils/designUtils";

export default function index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  const [nextRedirectPcUrl, setNextRedirectPcUrl] = useState("");
  const [nextRedirectMobileUrl, setNextRedirectMobileUrl] = useState("");
  const [tid, setTid] = useState("");
  const [state, setState] = useState({
    // 응답에서 가져올 값들
    next_redirect_pc_url: "",
    next_redirect_mobile_url: "",
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
      approval_url: "https://hourgoods.co.kr/payresult",
      fail_url: "https://hourgoods.co.kr/mypage",
      cancel_url: "https://hourgoods.co.kr/mypage",
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
    console.log("여기는 페이먼트! 충전 실행");
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
        console.log(response, "처음응답");
        const {
          data: { nextRedirectPcUrl, tid, nextRedirectMobileUrl },
        } = response;
        console.log(response);
        console.log(isMobileDevice);
        window.localStorage.setItem("tid", tid);
        setNextRedirectPcUrl(nextRedirectPcUrl);
        setNextRedirectMobileUrl(nextRedirectMobileUrl);
        setTid(tid);
        // window.location.href = response.data.next_redirect_pc_url;

        if (isMobileDevice()) {
          window.location.href = response.data.next_redirect_mobile_url;
        } else {
          window.location.href = response.data.next_redirect_pc_url;
        }
      })

      .catch((err) => {
        console.error(err);
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
