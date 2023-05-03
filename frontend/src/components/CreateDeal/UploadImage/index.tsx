import React, { useState, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function index(props: any) {
  const { inputImage, setInputImage } = props;
  const [inputImgUrl, setInputImageUrl] = useState("");
  const originalImageRef = useRef<HTMLInputElement>(null);

  // // 이미지를 업로드 했을 때 실행
  const uploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = originalImageRef.current?.files;
    if (files && files.length) {
      const fileURL = URL.createObjectURL(files[0]);
      // 미리보기 이미지
      setInputImageUrl(fileURL);
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
    <div className="create-deal-img-input-wrapper">
      <label htmlFor="uploadImg" className="file-input-label">
        {!inputImgUrl ? (
          <div className="upload-img-wrapper">
            <PhotoIcon />
            <p className="file-input-label-text">
              사진
              <br />
              추가하기
            </p>
          </div>
        ) : (
          <div className="upload-img-wrapper">
            <img src={inputImgUrl} alt="" />
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
