import { Axios, AxiosHeaders, AxiosResponse } from "axios";
import request from "./agents";

// 참고용 기존 로그인 api
/*
const memberAPI = {
  duplicateEmail: (email: string): Promise<AxiosResponse> =>
    request.get("member/duplicateEmail", {
      params: { email },
    }),
  duplicateNickName: (nickname: string): Promise<AxiosResponse> =>
    request.get("member/duplicateNickname", {
      params: { nickname },
    }),
  signUp: (userInfo: {
    nickname: string;
    password: string;
    organization: string;
    email: string;
  }): Promise<AxiosResponse> => request.post("member/signup", userInfo),
  logIn: (email: string, password: string): Promise<AxiosResponse> =>
    request.post("member/login", { email, password }),
  socialLogin: (
    accessToken: string,
    registrationId: string
  ): Promise<AxiosResponse> =>
    request.post("member/social/login", { accessToken, registrationId }),
  logOut: (accessToken: string, refreshToken: string): Promise<AxiosResponse> =>
    request.authPost("member/logout", { accessToken, refreshToken }),
  editUser: (userInfo: {
    id: number;
    nickname: string;
    organization: string;
    email: string;
    registrationId: string;
    profileImage: string;
  }): Promise<AxiosResponse> => request.authPut("member", userInfo),
};
*/

const memberAPI = {
  signup: (userInfo: {
    email: string;
    nickname: string;
    imageUrl: string;
  }): Promise<AxiosResponse> => request.post("member/signup", userInfo),
};

export { memberAPI };
