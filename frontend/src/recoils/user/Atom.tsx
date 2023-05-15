import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

// recoil로 로그인 상태 관리하기
// https://velog.io/@tamagoyakii/42byte-Recoil%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0

const { persistAtom } = recoilPersist();

// 로그인 권한정보
const AuthStateAtom = atom({
  key: "authState",
  default: {
    isLogin: false,
    token: null,
  },
  effects_UNSTABLE: [persistAtom],
});

// 유저 회원정보
const UserStateAtom = atom({
  key: "usersState",
  default: {
    email: "",
    nickname: "",
    imageUrl:
      "https://a204-hourgoods-bucket.s3.ap-northeast-2.amazonaws.com/image/member-profile/Union.svg",
    cash: 0,
  },
  effects_UNSTABLE: [persistAtom],
});

export { AuthStateAtom, UserStateAtom };
