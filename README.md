# 📍HourGoods📍 | 실시간 위치 기반 콘서트 굿즈 거래 플랫폼

![banner](./assets/banner.png)

## 🎈 프로젝트 소개

기간: 23.04.10 - 23.05.19 (6주)

인원: 총 5명 (프론트 3명 / 백엔드 2명)

삼성 청년 SW 아카데미 자율 프로젝트 우수상 🏆

## 🎈 서비스 소개

더 이상 콘서트장에서 교환하러, 거래하러 뛰어다니지 마세요!

### HourGoods는 위치를 기반으로 거래 정보를 제공합니다.

[소개자료](./docs/HourGoods_발표자료.pptx)

[UCC 영상](https://youtu.be/GzhYOYWfBq4)

## 🎈 핵심 기능

1.실시간 위치를 기반으로 콘서트장에 진입하면, 거래가 활성화 됩니다.

<img src="./assets/enter_concert.gif" width="300"/>

2.실시간 경매장에서 채팅과 입찰을 동시에 즐길 수 있습니다.

<img src="./assets/Auction_Bidding.gif" width="300"/>

3.공연 api를 활용해 실제 진행 예정인 콘서트 정보를 바탕으로 거래를 생성하고, 조회할 수 있습니다.

<img src="./assets/search_result.gif" width="300"/>

4.안전한 거래를 위해 30m 이내에서 포인트 차감 거래를 진행할 수 있습니다.

<img src="./assets/MeetingDealOnebyOne.gif" width="300"/>

5.카카오페이 결제 api를 통해 간편하게 포인트를 충전할 수 있습니다.

<img src="./assets/charge.gif" width="300"/>

## 🎈 서비스 화면

|                         | web                                                       | mobile                                                   |
| ----------------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| **실시간페이지**        | <img src="./assets/realtimePage_desktop.png"/>            | <img src="./assets/realtimePage_mobile.png" />           |
| **탐색하기**            | <img src="./assets/SearchPage_desktop.png"/>              | <img src="./assets/SearchPage_mobile.png"/>              |
| **콘서트 디테일**       | <img src="./assets/ConcertDetail_desktop.png"/>           | <img src="./assets/ConcertDetail_mobile.png"/>           |
| **딜 디테일**           | <img src="./assets/DealDetailActive_Full_desktop.png"/>   | <img src="./assets/DealDetailActive_Full_mobile.png"/>   |
| **딜 디테일(비활성화)** | <img src="./assets/DealDetailDeactive_Full_desktop.png"/> | <img src="./assets/DealDetailDeactive_Full_mobile.png"/> |
| **딜 생성하기**         | <img src="./assets/CreateDeal_desktop.png"/>              | <img src="./assets/CreateDeal_mobile.png"/>              |
| **마이페이지(메인)**    | <img src="./assets/Mypage_desktop.png"/>                  | <img src="./assets/Mypage_mobile.png"/>                  |
| **마이페이지(포인트)**  | <img src="./assets/MypagePoint_desktop.png"/>             | <img src="./assets/MypagePoint_mobile.png"/>             |
| **나의 채팅목록**       | <img src="./assets/PrivateChatList_desktop.png"/>         | <img src="./assets/PrivateChatList_mobile.png"/>         |
| **일대일 채팅창**       | <img src="./assets/PrivateChatroom_desktop.png"/>         | <img src="./assets/PrivateChatroom_mobile.png"/>         |
| **만나서 거래**         | <img src="./assets/MeetingDeal_desktop.png"/>             | <img src="./assets/MeetingDeal_mobile.png"/>             |
| **경매장**              | <img src="./assets/AuctionPage_desktop.png"/>             | <img src="./assets/AuctionPage_mobile.png"/>             |
| **경매 결과**           | <img src="./assets/AuctionResult_desktop.png"/>           | <img src="./assets/AuctionResult_mobile.png"/>           |
| **나눔 신청 결과**      | <img src="./assets/SharingResult_desktop.png"/>           | <img src="./assets/SharingResult_mobile.png"/>           |

## 🎈 개발 환경

`BACKEND` **|**
<img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=flat-square&logo=SpringBoot&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/SpringJPA-6DB33F?style=flat-square&logo=SpringJPA&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/SpringSecurity-6DB33F?style=flat-square&logo=SpringSecurity&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/QueryDsl-0089CF?style=flat-square&logo=QueryDsl&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/Stomp-000000?style=flat-square&logo=Stomp&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/Quartz-6F9FCE?style=flat-square&logo=Quartz&logoColor=white" align="center"/>

`DB` **|**
<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white" align="center"/>

`FRONTEND` **|**
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/Recoil-FD2251?style=flat-square&logo=Recoil&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/Sock.js-010101?style=flat-square&logo=Socket.io&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=Sass&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=ESLint&logoColor=white" align="center"/>

`CI/CD` **|**
<img src="https://img.shields.io/badge/Jenkins-D24939?style=flat-square&logo=Jenkins&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white" align="center"/>

`SERVER` **|**
<img src="https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=Nginx&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/CloudFront-E05243?style=flat-square&logo=CloudFront&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/AmazonS3-569A31?style=flat-square&logo=AmazonS3&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/AmazonEC2-FF9900?style=flat-square&logo=AmazonEC2&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/AWSLamda-FF9900?style=flat-square&logo=AWSLamda&logoColor=white" align="center"/>

`Monitoring` **|**
<img src="https://img.shields.io/badge/LightHouse-F44B21?style=flat-square&logo=LightHouse&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/prometheus-E6522C?style=flat-square&logo=prometheus&logoColor=white" align="center"/>
<img src="https://img.shields.io/badge/googleanalytics-E37400?style=flat-square&logo=googleanalytics&logoColor=white" align="center"/>
