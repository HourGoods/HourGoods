import React, { useState, useRef, useEffect } from "react";
import Button from "@components/common/Button";
import { useRecoilState } from "recoil";
import { UserStateAtom, AuthStateAtom } from "@recoils/user/Atom";
import { memberAPI } from "@api/apis";
import uploadProfileImage from "@utils/uploadProfileImage";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";

export default function index() {
  const [inputImage, setInputImage] = useState({
    file: null,
    filename: "",
  });

  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);

  useEffect(() => {
    console.log(userInfo);
  }, []);

  // 이미지 업로드
  const [uploadedImage, setUploadedIamge] = useState<string>("");
  const uploadImageRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="signup-page-main-container">
      <h2>회원 가입 🎉</h2>
      <p>프로필 사진과 닉네임을 설정하면 가입이 완료 됩니다 </p>
      <div className="signup-desktop-flex-div">
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
          <button type="button" className="add-profile-img-button">
            사진 등록하기
            <ChevronRightIcon />
          </button>
        </label>
        <p>닉네임</p>
        <div className="nickname-input-wrapper">
          <input type="text" />
          <button type="button">중복 확인</button>
        </div>
      </div>
    </div>
  );
}
