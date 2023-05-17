import React, { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cropper, { ReactCropperElement } from "react-cropper";
import { toast, ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";
import { memberAPI } from "@api/apis";
import Button from "@components/common/Button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import uploadProfileImage from "@utils/uploadProfileImage";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";
import "@styles/Cropper.scss";

export default function index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  const navigate = useNavigate();

  // 올릴 이미지
  const [inputImage, setInputImage] = useState({
    file: null,
    filename: "",
  });
  // 이미지 업로드
  const [uploadedImage, setUploadedIamge] = useState<string>("");
  const uploadImageRef = useRef<HTMLInputElement>(null);
  const [originalFileName, setOriginalFileName] = useState("");

  // 이미지 자르기 팝업
  const [isEditor, setIsEditor] = useState(false);

  // 잘린 이미지
  const [croppedImage, setCroppedImage] = useState("");
  const croppedImageRef = useRef<ReactCropperElement>(null);

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

  // 닉네임 변경
  const location = useLocation();
  const fromMy = location.state.mypage;

  const [nicknameInput, setNicknameInput] = useState<string>("");
  const [nicknameValid, setNicknameValid] = useState<boolean>(false);

  const nicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target) {
      const newNickname = target.value;
      setNicknameInput(newNickname);
    }
    setNicknameValid(false);
    setCheckAlert(0);
  };
  const [checkAlert, setCheckAlert] = useState(0);

  const nicknameChecker = (e: any) => {
    e.preventDefault();
    const regex = /^[a-zA-Z0-9가-힣]{2,10}$/;
    if (regex.test(nicknameInput)) {
      console.log(nicknameInput);
      const nickname = nicknameInput;
      const result = memberAPI.duplicateNickname(nickname);
      result
        .then((res) => {
          console.log(res);
          if (res.data.result === true) {
            const newNickname = nicknameInput;
            const newUserInfo = { ...userInfo };
            newUserInfo.nickname = newNickname;
            setUserInfo(newUserInfo);
            setNicknameValid(true);
            setCheckAlert(1);
          } else {
            setCheckAlert(2);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setCheckAlert(3);
    }
  };

  // 회원 수정

  const editHandleClick = useCallback(() => {
    memberAPI
      .editUser(userInfo)
      .then(() => {
        navigate("/mypage");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [setUserInfo, userInfo]);

  const editprofile = async () => {
    // 로딩 추가하기
    if (inputImage.file) {
      try {
        // 이미지 업로드하여 이미지 주소 받아오기
        const imageUrl = await uploadProfileImage(
          inputImage.file,
          inputImage.filename,
          nicknameInput
        );
        if (imageUrl) {
          // img CDN
          const baseUrl =
            "https://a204-hourgoods-bucket.s3.ap-northeast-2.amazonaws.com/";
          const trimmedUrl = imageUrl.substring(baseUrl.length);

          // POST API 요청
          let { nickname } = userInfo;
          if (nicknameInput) {
            nickname = nicknameInput;
          }
          const result = memberAPI.editUser({
            ...userInfo,
            nickname,
            imageUrl: trimmedUrl,
          });
          result.then((res) => {
            console.log(res);
            // const { dealId } = res.data.result;
            toast.success("정보가 변경되었습니다!", { autoClose: 1000 });
            setUserInfo((prevUserInfo: any) => ({
              ...prevUserInfo,
              imageUrl: trimmedUrl,
            }));
            navigate(`/mypage`);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (!inputImage.file) {
      let { nickname } = userInfo;
      if (nicknameInput) {
        nickname = nicknameInput;
      }
      const result = memberAPI.editUser({ ...userInfo, nickname });
      result.then((res) => {
        console.log(res);
        // const { dealId } = res.data.result;
        toast.success("정보가 변경되었습니다!", { autoClose: 1000 });
        navigate(`/mypage`);
        setUserInfo((prevUserInfo: any) => ({
          ...prevUserInfo,
          imageUrl: uploadedImage,
        }));
      });
    }
  };

  // input enter
  const handleOnKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      nicknameChecker(e); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  console.log(userInfo);

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
      <div className="upper">
        <div className="updateprofile-container">
          <div className="updateprofile-contents-container">
            <div className="updateprofile-contents-container-desktop">
              <label htmlFor="uploadImg">
                <h2>회원정보 수정💝</h2>
                <div className="updateprofile-contents-container-wrapper">
                  {/* <img src={userInfo.imageUrl} alt="프로필 사진" /> */}
                  {!uploadedImage && userInfo.imageUrl !== "" ? (
                    <img
                      src={`https://d15nekhnxhc8rz.cloudfront.net/${userInfo.imageUrl}`}
                      alt="프로필 사진"
                    />
                  ) : (
                    <img src={croppedImage} alt="프로필 사진" />
                  )}
                  <input
                    id="uploadImg"
                    type="file"
                    accept=".jpg, .jpeg, .png "
                    onChange={uploadHandler}
                    ref={uploadImageRef}
                    style={{ display: "none" }}
                  />
                  <button type="button" onClick={handleButtonClick}>
                    사진 등록하기
                    <ChevronRightIcon />
                  </button>
                </div>
              </label>
              <form className="updateprofile-contents-container-form">
                <h3>닉네임</h3>
                <div className="updateprofile-contents-container-form-wrapper">
                  <input
                    type="text"
                    id="nickname"
                    placeholder={userInfo.nickname}
                    onChange={nicknameHandler}
                    onKeyPress={handleOnKeyPress}
                  />
                  <button type="button" onClick={nicknameChecker}>
                    중복 확인
                    {/* {fromMy ? "변경" : "중복 확인"} */}
                  </button>
                </div>
                {checkAlert === 0 ? <p /> : null}
                {checkAlert === 1 ? (
                  <p style={{ color: "#4F46E5" }}>사용 가능한 닉네임입니다. </p>
                ) : null}
                {checkAlert === 2 ? (
                  <p>중복된 닉네임입니다! 다시 입력해주세요.</p>
                ) : null}
                {checkAlert === 3 ? (
                  <p className="check-alert-3-p">
                    특수문자와 공백 없이 2~10자로 입력해주세요.
                  </p>
                ) : null}
              </form>
            </div>
            <div className="update-button-wrapper">
              <Button onClick={editprofile}>회원정보 수정하기</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
