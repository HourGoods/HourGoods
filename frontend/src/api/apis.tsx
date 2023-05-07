import { AxiosResponse } from "axios";
import request from "./agents";

const mypageAPI = {
  pointHistory: (lastPointHistoryId: number): Promise<AxiosResponse> =>
    request.authGet("mypage/point", { params: { lastPointHistoryId } }),
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
    searchKeyword: string,
    nickname?: string
  ): Promise<AxiosResponse> =>
    request.get("deal/list", {
      params: { concertId, lastDealId, dealTypeName, searchKeyword, nickname },
    }),

  // 사용자 근처 오늘의 공연
  getTodayConcert: (
    longitude: number,
    latitude: number
  ): Promise<AxiosResponse> =>
    request.get("concert/today", {
      params: { longitude, latitude },
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

  // Deal 북마크
  postBookmark: (dealId: number): Promise<AxiosResponse> =>
    request.authPost("deal/bookmark", { dealId }),
  // Deal 북마크 해제
  deleteBookmark: (dealId: number): Promise<AxiosResponse> =>
    request.authDelete("deal/bookmark", { data: { dealId } }),
};

// 채팅관련 api
const chattingAPI = {
  // 내채팅 목록 조회
  getmychatList: (): Promise<AxiosResponse> => request.authGet("/chat/list"),
  // 일대일채팅창 대화내용 조회
  getmychatMsg: (chattingRoomId: number): Promise<AxiosResponse> =>
    request.authGet(`/chat/${chattingRoomId}/messages`),
  // 일대일채팅방 생성하기
  postchatDirect: (
    receiverId: number,
    dealId: number
  ): Promise<AxiosResponse> =>
    request.authPost("/chat/direct", { receiverId, dealId }),
};

// 경매관련 api
const AuctionAPI = {
  // 가능한 경매인지 조회
  getableAuction: (dealId: number): Promise<AxiosResponse> =>
    request.authGet("/auction/available", { params: { dealId } }),
};

export { memberAPI, concertAPI, dealAPI, mypageAPI, chattingAPI, AuctionAPI };
