/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from "react";
import { dealAPI, mypageAPI } from "@api/apis";
import UserInfo from "@components/MyPage/UserInfo";
import UserCash from "@components/MyPage/UserCash";
import UserDeal from "@components/MyPage/UserDeal";
import "./index.scss";
import Modal from "@components/common/Modal";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";
import {
  isDeleteCardModal,
  isAuctionAlarmModal,
  isdealDelete,
} from "../../recoils/mypageModal/Atoms";

export default function index() {
  const [modalOpen, setModalOpen] = useRecoilState(isDeleteCardModal);
  const [dealId, setDealId] = useRecoilState(isdealDelete);
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);

  console.log(userInfo);
  const localLogin = localStorage.getItem("isLogin");
  // const { isLogin } = useRecoilValue(AuthStateAtom)

  // 삭제
  const handleDelete = (dealId: number) => {
    dealAPI
      .getDealDelete(dealId)
      .then((res) => {
        setModalOpen(false);
        console.log(res);
        // 새로고침 넣으세여
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (localLogin) {
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
    }
  }, [localLogin]);
  console.log(userInfo);

  return (
    <div className="mypage-main-container">
      <div className="mypage-contents-container">
        <UserInfo />
        <UserCash />
        <UserDeal />
        {modalOpen && (
          <Modal setModalOpen={setModalOpen}>
            <div className="deal-card-delete-modal">
              <p className="modal-p1">
                1. 거래는 콘서트가 끝나면 자동으로 비공개 됩니다.
              </p>
              <p className="modal-p2">
                2. 삭제 시 현재까지의 참여 내역도 함께 삭제 됩니다.
              </p>
              <h2 className="modal-h2">정말 삭제하시겠습니까?</h2>
              <div className="common-modal-button">
                <button
                  type="button"
                  className="yes-button"
                  onClick={() => handleDelete(dealId)}
                >
                  예
                </button>
                <button
                  type="button"
                  className="no-button"
                  onClick={() => setModalOpen(false)}
                >
                  아니오
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
