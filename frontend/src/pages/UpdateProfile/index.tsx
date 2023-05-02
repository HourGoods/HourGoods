import React, { useRef, useState } from "react";
import Button from "@components/common/Button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import "./index.scss";

export default function index() {
  const [uploadedImage, setUploadedIamge] = useState<string>(
    "https://openimage.interpark.com/goods_image_big/1/3/6/7/10657921367_l.jpg"
  );
  const uploadImageRef = useRef<HTMLInputElement>(null);

  const uploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = uploadImageRef.current?.files;
    if (files && files.length) {
      const fileURL = URL.createObjectURL(files[0]);
      setUploadedIamge(fileURL);
    }
  };

  const handleButtonClick = () => {
    uploadImageRef.current?.click();
  };

  return (
    <div className="upper">
      <div className="updateprofile-container">
        <div className="updateprofile-contents-container">
          <div className="updateprofile-contents-container-desktop">
            <label htmlFor="uploadImg">
              <h2>회원정보 수정</h2>
              <div className="updateprofile-contents-container-wrapper">
                <img src={uploadedImage} alt="프로필 사진" />
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
                <input type="text" id="nickname" placeholder="아이유사랑해" />
                <button type="button">변경</button>
              </div>
              <p>중복된 닉네임입니다! 다시 입력해주세요</p>
            </form>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button color="dark-blue">회원정보 수정하기</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
