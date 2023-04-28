import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const authState = atom({
  key: "authState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

const userState = atom({
  key: "usersState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export { authState, userState };
