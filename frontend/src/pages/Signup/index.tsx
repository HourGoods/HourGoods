import React, { useState, useRef, useEffect } from "react";
import Button from "@components/common/Button";
import { useRecoilState } from "recoil";
import { UserStateAtom, AuthStateAtom } from "@recoils/user/Atom";
import { memberAPI } from "@api/apis";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import uploadProfileImage from "@utils/uploadProfileImage";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";

export default function index() {
  const [inputImage, setInputImage] = useState({
    file: null,
    filename: "",
  });
  // 닉네임 확인
  const [inputNickname, setInputNickname] = useState("");
  const [isValidNickname, setIsValidNickname] = useState(false);
  const [nicknameAlert, setNicknamAlert] = useState("");
  // 이미지 업로드 미리보기 값
  const [uploadedImage, setUploadedIamge] = useState<string>("");
  const uploadImageRef = useRef<HTMLInputElement>(null);

  // recoil
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);

  // token
  const [cookies, setCookie] = useCookies(["refreshToken"]);

  // 이동
  const navigate = useNavigate();

  // login이나, signup에서 안 온 경우는 막아야 함
  useEffect(() => {
    console.log(userInfo);
    if (!userInfo.email) {
      toast.error("비정상적 접근입니다.", {
        position: "top-center",
        autoClose: 2000,
      });
      navigate("/");
    }
  }, []);

  // 업로드
  const uploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = uploadImageRef.current?.files;

    if (files && files.length) {
      const fileURL = URL.createObjectURL(files[0]);
      setUploadedIamge(fileURL);
      const file = files[0];
      const filename = file.name;
      setInputImage((prev: any) => ({
        ...prev,
        file,
        filename,
      }));
    }
  };
  const handleButtonClick = () => {
    uploadImageRef.current?.click();
  };

  // 닉네임 유효성 검사
  const nicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 변화값 저장
    const newNickname = e.target.value;
    setInputNickname(newNickname);
    // 알림 초기화
    setNicknamAlert("");
    // 유효성 검사
    const regex = /^[a-zA-Z0-9가-힣]{2,16}$/;
    if (regex.test(newNickname)) {
      setIsValidNickname(true);
    } else {
      setIsValidNickname(false);
    }
  };

  // 닉네임 중복 확인 api
  const nicknameChecker = (e: any) => {
    console.log(inputNickname, isValidNickname);
    if (inputNickname && isValidNickname) {
      const nickname = inputNickname;
      const result = memberAPI.duplicateNickname(nickname);
      result.then((res) => {
        console.log(res);
        if (res.data.result === true) {
          setNicknamAlert("valid");
        } else {
          setNicknamAlert("duplicated");
        }
      });
    }
  };

  // 회원가입
  const signupHandler = async () => {
    console.log("가입해보까");
    const params = new URLSearchParams(window.location.search);
    // img가 있는 경우
    if (inputImage.file) {
      try {
        // 이미지 업로드하여 이미지 주소 받아오기
        const imageUrl = await uploadProfileImage(
          inputImage.file,
          inputImage.filename
        );
        if (imageUrl) {
          // 회원가입 API 요청
          // 기존처럼 닉네임이 변할 때마다 recoilValue를 업데이트 하면 중간에 나갔을 때 문제가 생깁니다.
          const nickname = inputNickname;
          const result = memberAPI.signup({ ...userInfo, nickname, imageUrl });
          result.then((res) => {
            // 로그인 여부도 저장
            localStorage.setItem("isLogin", "true");
            // token저장
            const accessToken = params.get("access") || "";
            const refreshToken = params.get("refresh") || "";
            localStorage.setItem("accessToken", accessToken);
            setCookie("refreshToken", refreshToken);
            // recoil update
            setUserInfo((prevUserInfo: any) => ({
              ...prevUserInfo,
              imageUrl,
            }));
            // 이동
            navigate("/mypage");
            // 알림
            toast.success(`${userInfo.nickname}님 환영합니다!`);
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    // img가 없는 경우
    if (!inputImage.file) {
      // 로그인 여부도 저장
      // 회원가입 API 요청
      const nickname = inputNickname;
      const result = memberAPI.signup({ ...userInfo, nickname });
      result.then((res) => {
        localStorage.setItem("isLogin", "true");
        // token저장
        const accessToken = params.get("access") || "";
        const refreshToken = params.get("refresh") || "";
        localStorage.setItem("accessToken", accessToken);
        setCookie("refreshToken", refreshToken);
        // 이동
        navigate("/mypage");
        // 알림
        toast.success(`${nickname}님 환영합니다!`);
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="signup-page-main-container">
        <h2>회원 가입 🎉</h2>
        <div className="signup-desktop-flex-div">
          {/* 좌측 */}
          <label htmlFor="uploadImg">
            {uploadedImage ? (
              <img src={uploadedImage} alt="프로필 사진" />
            ) : (
              <img src={userInfo.imageUrl} alt="프로필 사진" />
            )}
            <input
              id="uploadImg"
              type="file"
              accept=".jpg, .jpeg, .png "
              onChange={uploadHandler}
              ref={uploadImageRef}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="add-profile-img-button"
              onClick={handleButtonClick}
            >
              사진 등록하기
              <ChevronRightIcon />
            </button>
          </label>

          {/* 우측 */}
          <div className="signup-desktop-right-box">
            <div className="text-input-wrapper">
              <p>가입 이메일</p>
              <div className="email-nickname-input-wrapper">
                <input type="text" value={userInfo.email} disabled />
                <button type="button">
                  <CheckBadgeIcon />
                </button>
              </div>
            </div>
            <div className="text-input-wrapper">
              <p>닉네임 설정</p>
              <div className="email-nickname-input-wrapper">
                <input
                  type="text"
                  onChange={nicknameHandler}
                  value={inputNickname}
                />
                <button type="button" onClick={nicknameChecker}>
                  {nicknameAlert === "valid" ? <CheckBadgeIcon /> : "중복 확인"}
                </button>
              </div>
            </div>
            <div className="nickname-alert-msg-wrapper">
              {!isValidNickname && (
                <p>※ 특수문자와 공백 없이 2~10자로 입력해주세요.</p>
              )}
              {nicknameAlert === "duplicated" && (
                <p>중복된 닉네임입니다! 다시 입력해주세요.</p>
              )}
              {nicknameAlert === "valid" && (
                <p className="success-p">사용할 수 있는 닉네임입니다.</p>
              )}
              {isValidNickname && <p>&nbsp;</p>}
            </div>
          </div>
        </div>
        {/* 하단 */}
        <div className="signup-button-wrapper">
          <Button onClick={signupHandler}>가입하기</Button>
        </div>
      </div>
    </>
  );
}
