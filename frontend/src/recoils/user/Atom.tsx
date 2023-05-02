import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

// recoil로 로그인 상태 관리하기
// https://velog.io/@tamagoyakii/42byte-Recoil%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0

const { persistAtom } = recoilPersist();

const AuthStateAtom = atom({
  key: "authState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

const UserStateAtom = atom({
  key: "usersState",
  default: {
    email: "",
    registrationId: "kakao",
    nickname: "이지은",
    imageUrl:
      "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/06/28/612b6ff6-5081-4b54-a22c-38d716229c41.jpg",
  },
  effects_UNSTABLE: [persistAtom],
});

export { AuthStateAtom, UserStateAtom };
