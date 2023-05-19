/* eslint-disable react/react-in-jsx-scope */
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";

export default function index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  // const newUserInfo = { ...userInfo };

  const navigate = useNavigate();
  const navigateHandler = () => {
    navigate("/update/profile", { state: { mypage: true } });
  };

  return (
    <div className="userinfo-container">
      <div className="userinfo-wrapper">
        {/* <p className="userid">{newUserInfo.nickname}</p> */}
        <p className="userid">{userInfo.nickname}</p>
        {/* <Link to="/updateprofile"> */}
        <button
          type="button"
          className="edit-profile-button"
          onClick={navigateHandler}
        >
          {`프로필 수정하기 `}
          <ChevronRightIcon />
        </button>
        {/* </Link> */}
      </div>
      {/* <UserCircleIcon /> */}
      {/* <img alt="프로필 사진" className="profile" src={newUserInfo.imageUrl} /> */}
      {userInfo.imageUrl && userInfo.imageUrl !== "" ? (
        <img
          alt="프로필 사진"
          className="profile"
          src={`https://d15nekhnxhc8rz.cloudfront.net/${userInfo.imageUrl}`}
        />
      ) : null}
    </div>
  );
}
