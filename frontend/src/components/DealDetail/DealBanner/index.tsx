import React from "react";

export default function index(props: any) {
  const { dealInfo } = props;
  return (
    <div className="deal-banner-component-container">
      <div className="seller-profile-infos-container">
        <p>{dealInfo.userNickname}</p>
        <img src={dealInfo.userImageUrl} alt="" />
      </div>
      <div className="product-img-wrapper">
        <img src={dealInfo.dealImageUrl} alt="" />
      </div>
    </div>
  );
}

