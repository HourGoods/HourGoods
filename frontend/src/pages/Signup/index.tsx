/* eslint-disable no-nested-ternary */
import React, { useState, useRef, useEffect } from "react";
import Button from "@components/common/Button";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";
import { memberAPI } from "@api/apis";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Cropper, { ReactCropperElement } from "react-cropper";
import uploadProfileImage from "@utils/uploadProfileImage";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";

export default function index() {
  // 올릴 이미지
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
  const [originalFileName, setOriginalFileName] = useState("");
  // 이미지 자르기 팝업
  const [isEditor, setIsEditor] = useState(false);
  // 잘린 이미지
  const [croppedImage, setCroppedImage] = useState("");
  const croppedImageRef = useRef<ReactCropperElement>(null);

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
      // 자를 이미지
      setUploadedIamge(fileURL);
      // editor 켜기
      setIsEditor(true);
      // 원래 이름 저장
      setOriginalFileName(files[0].name);
    }
  };
  const handleButtonClick = () => {
    uploadImageRef.current?.click();
  };

  const cropperHandler = () => {
    if (typeof croppedImageRef.current?.cropper !== "undefined") {
      const tempCroppedCanvas =
        croppedImageRef.current?.cropper.getCroppedCanvas({
          maxHeight: 200,
          maxWidth: 200,
        });

      // canvas를 Blob으로 변환
      tempCroppedCanvas.toBlob((blob) => {
        if (blob) {
          // blob 값이 null인 경우 처리
          // Blob을 File 객체로 변환
          const file = new File([blob], originalFileName, {
            type: "image/webp",
          });

          setInputImage((prev: any) => ({
            ...prev,
            file,
            filename: originalFileName,
          }));
        }
      }, "image/webp");

      const tempCroppedImage = tempCroppedCanvas.toDataURL();
      setCroppedImage(tempCroppedImage);
    }
  };

  const editorHandler = () => {
    setIsEditor(false);
    if (uploadImageRef.current) {
      uploadImageRef.current.value = "";
    }
  };

  // 닉네임 유효성 검사
  const nicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 변화값 저장
    const newNickname = e.target.value;
    setInputNickname(newNickname);
    // 알림 초기화
    setNicknamAlert("");
    // 유효성 검사
    const regex = /^[a-zA-Z0-9가-힣]{2,10}$/;
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
          inputImage.filename,
          inputNickname
        );
        if (imageUrl) {
          // img CDN
          const baseUrl =
            "https://a204-hourgoods-bucket.s3.ap-northeast-2.amazonaws.com/";
          const trimmedUrl = imageUrl.substring(baseUrl.length);
          // 회원가입 API 요청
          // 기존처럼 닉네임이 변할 때마다 recoilValue를 업데이트 하면 중간에 나갔을 때 문제가 생깁니다.
          const nickname = inputNickname;
          const result = memberAPI.signup({
            ...userInfo,
            nickname,
            imageUrl: trimmedUrl,
          });
          result.then((res) => {
            // 로그인 여부도 저장
            localStorage.setItem("isLogin", "true");
            // token저장
            console.log("이게 받아온 데이터", res);
            const accessToken = res.data.result.accessToken || "";
            const refreshToken = res.data.result.refreshToken || "";
            localStorage.setItem("accessToken", accessToken);
            setCookie("refreshToken", refreshToken);
            // recoil update
            setUserInfo((prevUserInfo: any) => ({
              ...prevUserInfo,
              nickname,
              imageUrl,
            }));
            // 이동
            navigate("/mypage");
            // 알림
            toast.success(`${nickname}님 환영합니다!`, {
              autoClose: 2000,
            });
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
        console.log("이게 받아온 데이터", res);
        const accessToken = res.data.result.accessToken || "";
        const refreshToken = res.data.result.refreshToken || "";
        localStorage.setItem("accessToken", accessToken);
        setCookie("refreshToken", refreshToken);
        // recoil update
        setUserInfo((prevUserInfo: any) => ({
          ...prevUserInfo,
          nickname,
        }));
        // 이동
        navigate("/mypage");
        // 알림
        toast.success(`${nickname}님 환영합니다!`, {
          autoClose: 2000,
        });
      });
    }
  };

  return (
    <>
      <ToastContainer />
      {isEditor && (
        <div className="image-editior-wrapper">
          <div
            className="image-editor-overlay"
            onClick={editorHandler}
            onKeyDown={editorHandler}
            role="presentation"
          />

          <div className="image-editor-content">
            <div className="image-editor-image">
              <Cropper
                src={uploadedImage}
                style={{
                  maxHeight: "60vh",
                  maxWidth: "90vw",
                  // overflow: "auto",
                }}
                minCropBoxHeight={100}
                minCropBoxWidth={100}
                viewMode={0}
                aspectRatio={1}
                background={false}
                ref={croppedImageRef}
              />
            </div>
            <div className="image-editor-buttons">
              <button
                type="button"
                onClick={() => {
                  cropperHandler();
                  editorHandler();
                }}
              >
                제출하기
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="signup-page-main-container">
        <h2>회원 가입 🎉</h2>
        <div className="signup-desktop-flex-div">
          {/* 좌측 */}
          <label htmlFor="uploadImg">
            {uploadedImage ? (
              <img src={croppedImage} alt="프로필 사진" />
            ) : userInfo.imageUrl !== "" ? (
              <img
                src={`https://d15nekhnxhc8rz.cloudfront.net/${userInfo.imageUrl}`}
                alt="프로필 사진"
              />
            ) : null}
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
