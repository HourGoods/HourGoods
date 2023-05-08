import React, { useState } from "react";
import FavoriteDeal from "@components/MyPage/UserDeal/FavoriteDeal";
import GetMyDeal from "@components/MyPage/UserDeal/GetMyDeal";
import ParticipatedDeal from "@components/MyPage/UserDeal/ParticipatedDeal";
import classNames from "classnames";

export default function index() {
  const [tag, setTag] = useState({
    getMy: true,
    favorite: false,
    participated: false,
  });

  const handleClick = (tagName: string) => {
    setTag((prev) => ({
      ...prev,
      favorite: tagName === "favorite",
      getMy: tagName === "getMy",
      participated: tagName === "participated",
    }));
  };

  return (
    <div className="userdeal-components-container">
      <div className="userdeal-tabs-container">
        <button
          type="button"
          onClick={() => handleClick("getMy")}
          className={classNames(tag.getMy && "activated")}
        >
          내가 만든 Deal
        </button>
        <button
          type="button"
          onClick={() => handleClick("favorite")}
          className={classNames(tag.favorite && "activated")}
        >
          찜한 Deal
        </button>
        <button
          type="button"
          onClick={() => handleClick("participated")}
          className={classNames(tag.participated && "activated")}
        >
          참여한 Deal
        </button>
      </div>

      {tag.getMy && <GetMyDeal />}
      {tag.favorite && <FavoriteDeal />}
      {tag.participated && <ParticipatedDeal />}
    </div>
  );
}
