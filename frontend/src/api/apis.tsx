import { promises } from "dns";
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

const mypageAPI = {
  pointHistory: (lastPointHistoryId: number): Promise<AxiosResponse> =>
    request.authGet("mypage/point", { params: { lastPointHistoryId } }),
  getMyDeal: (lastDealId: number): Promise<AxiosResponse> =>
    request.authGet("mypage/create", { params: { lastDealId } }),
  favoriteDeal: (lastDealId: number): Promise<AxiosResponse> =>
    request.authGet("mypage/bookmark", { params: { lastDealId } }),
  participateDeal: (lastDealId: number): Promise<AxiosResponse> =>
    request.authGet("mypage/attend", { params: { lastDealId } }),
};

const memberAPI = {
  signup: (userInfo: {
    email: string;
    nickname: string;
    imageUrl: string;
  }): Promise<AxiosResponse> => request.post("member/signup", userInfo),
  duplicateNickname: (nickname: string): Promise<AxiosResponse> =>
    request.authPost("duplicateNickname", { nickname }),
  editUser: (userInfo: {
    nickname: string;
    imageUrl: string;
  }): Promise<AxiosResponse> => request.authPut("member/profile", userInfo),
};

const concertAPI = {
  // 전체 콘서트 조회(공연 api)
  getAllConcert: (keyword: string): Promise<AxiosResponse> =>
    request.get("concert/search", {
      params: { keyword },
    }),

  // DB상 콘서트 등록 여부를 확인하고, 있으면 DB상 id반환,  없으면 등록한다
  postConcertId: (kopisConcertId: string): Promise<AxiosResponse> =>
    request.post("concert", { kopisConcertId }),

  // 공연 detail 조회
  getConcertDetail: (concertId: number): Promise<AxiosResponse> =>
    request.get("concert", { params: { concertId } }),

  // 공연별 Deal 검색 및 상세 리스트 조회
  getConcertDealList: (
    concertId: number,
    lastDealId: number,
    dealTypeName: string,
    searchKeyword: string
  ): Promise<AxiosResponse> =>
    request.get("deal/list", {
      params: { concertId, lastDealId, dealTypeName, searchKeyword },
    }),
};

const dealAPI = {
  // Deal 생성
  postDeal: (dealInfo: {
    imageUrl: string;
    title: string;
    content: string;
    startTime: string;
    longitude: number;
    latitude: number;
    // memberId: number;
    concertId: number;
    dealType: string;
    minimumPrice: number;
    endTime: string;
    limit: number;
    price: number;
  }): Promise<AxiosResponse> => request.authPost("deal/create", dealInfo),

  // Deal 조회
  getDealDeatail: (dealId: number): Promise<AxiosResponse> =>
    request.authGet("deal/detail", { params: { dealId } }),
  // Deal 삭제

  getDealDelete: (dealId: number): Promise<AxiosResponse> =>
    request.authDelete(`deal/${dealId}`),
};

export { memberAPI, concertAPI, dealAPI, mypageAPI };
