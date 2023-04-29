import React, { useState, useRef } from "react";

export default function index() {
  const [inputImage, setInputImage] = useState<string>("");
  const originalImageRef = useRef<HTMLInputElement>(null);

  // // 이미지를 업로드 했을 때 실행
  const uploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = originalImageRef.current?.files;
    if (files && files.length) {
      const fileURL = URL.createObjectURL(files[0]);
      setInputImage(fileURL);
    }
  };

  return (
    <div className="create-deal-img-input-wrapper">
      <label htmlFor="uploadImg" className="file-input-label">
        {!inputImage ? (
          <div className="upload-img-wrapper">
            <p className="file-input-label-plus">+</p>
            <p className="file-input-label-text">
              사진
              <br />
              추가하기
            </p>
          </div>
        ) : (
          <div className="upload-img-wrapper">
            <img src={inputImage} alt="" />
          </div>
        )}
        <input
          id="uploadImg"
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={uploadHandler}
          ref={originalImageRef}
        />
      </label>
    </div>
  );
}
