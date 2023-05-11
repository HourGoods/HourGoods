import React, { useState } from "react";
import DropDown from "@components/common/DropDown";
import { useRecoilValue } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";

export default function index(props: any) {
  const { dealInfo } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userInfo = useRecoilValue(UserStateAtom);

  // 본인이 아닐 때만 신고 가능
  const creatorProfileHandler = () => {
    if (userInfo.nickname !== dealInfo.userNickname) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  return (
    <div className="deal-banner-component-container">
      <div className="seller-profile-infos-container">
        <p>{dealInfo.userNickname}</p>
        <button type="button" onClick={creatorProfileHandler}>
          <img src={dealInfo.userImageUrl} alt="" />
        </button>
        {dropdownOpen ? (
          <DropDown
            menus={[
              {
                label: "게시자 신고하기",
                onClick: () => {
                  setIsModalOpen(true);
                  alert("신고되었습니다!");
                },
              },
            ]}
          />
        ) : null}
      </div>
      <div className="product-img-wrapper">
        <img src={dealInfo.dealImageUrl} alt="" />
      </div>
    </div>
  );
}
