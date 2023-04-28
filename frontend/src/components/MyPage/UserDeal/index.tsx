import React, { useState } from "react";
import FavoriteDeal from "@components/MyPage/UserDeal/FavoriteDeal";
import GetMyDeal from "@components/MyPage/UserDeal/GetMyDeal";
import ParticipatedDeal from "@components/MyPage/UserDeal/ParticipatedDeal";

export default function index() {
  const [tag, setTag] = useState({
    favorite: true,
    getMy: false,
    participated: false,
  });

  const handleClick = (tagName: string) => {
    setTag((prevTag) => ({
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
          onClick={() => handleClick("favorite")}
          // className="favorite"
        >
          찜한 Deal
        </button>
        <button
          type="button"
          onClick={() => handleClick("getMy")}
          // className="getmy"
        >
          내가 만든 Deal
        </button>
        <button
          type="button"
          onClick={() => handleClick("participated")}
          // className="participated"
        >
          참여한 Deal
        </button>
      </div>

      {tag.favorite && <FavoriteDeal />}
      {tag.getMy && <GetMyDeal tag={tag.getMy} />}
      {tag.participated && <ParticipatedDeal />}
    </div>
  );
}
