/* eslint-disable */
import { memberAPI } from "@api/apis";
import { UserStateAtom } from "@recoils/user/Atom";
import React, { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import Button from "@components/common/Button";
import { useNavigate } from "react-router-dom";

/** To.길현
 * 회원가입 로직
 * 1. 최초로그인 경우 -> email만 받기 때문에 /edit(프로필 수정페이지)로 리다이렉트를 시킴
 *
 * 2. 프로필 수정페이지의 경우
 * 2-1. 닉네임(필수) -> 프론트에서 null일 경우 막아줘야해요.
 * 2-2. 닉네임 중복확인 -> api 요청을 보내서 중복확인 검사 해야함. 중복확인을 안 했을 경우 다음 로직으로 넘어가지 못하도록 alert 띄우기
 * 2-3. 사진(옵션) -> 사진 업로드는 필수는 아니에요. 사진 업로드가 없다면 S3에 업로드된 기본 이미지가 state에 담길 예정
 *
 * 3. 유저로부터 input 받은 값을 사용할 곳은 두 군데
 * 3-1. UserStateAtom (프론트에서 사용할 state값)
 * 3-2. 백엔드에 보내줄 userInfo 데이터값 객체
 *
 * 즉, 정리하자면
 * 회원가입페이지 = 프로필수정페이지
 * 갓챠에 예시코드가 있으니 참고(https://github.com/GotchaAIGame/Gotcha/blob/master/frontend/src/components/RankPage/PlayerRank.tsx)
 * 1. 마이페이지에서 넘어온 경우 = [회원정보 수정하기] 버튼
 * 2. 그 외의 경우 = [회원가입하기] 버튼
 * 두 개의 버튼은 각각 전송하는 api가 다르니 [회원정보 수정하기] api만 작업해주세요~
 */

export default function Index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    const newUserInfo = { ...userInfo };
    // 임시저장값 -> 삭제하고 사용해주세요.
    newUserInfo.nickname = "다솜";
    newUserInfo.imageUrl =
      "https://avatars.githubusercontent.com/u/88919138?v=4";
    setUserInfo(newUserInfo);
    console.log(newUserInfo);

    memberAPI
      .signup(userInfo)
      .then(() => {
        // 회원가입완료
        // console.log(userInfo);
        navigate("/update/profile", { state: { mypage: false } });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [setUserInfo, userInfo]);

  return (
    <>
      <div>수정페이지</div>
      <Button onClick={handleClick}>회원가입하기</Button>
    </>
  );
}
