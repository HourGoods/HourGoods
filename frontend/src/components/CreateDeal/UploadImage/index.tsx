import React, { useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { PhotoIcon } from "@heroicons/react/24/solid";
import "@styles/Cropper.scss";

export default function index(props: any) {
  const { inputImage, setInputImage } = props;
  // 잘라야할 처음 올린 이미지
  const [inputImgUrl, setInputImageUrl] = useState("");
  const originalImageRef = useRef<HTMLInputElement>(null);
  const [originalFileName, setOriginalFileName] = useState("");

  // 이미지 자르기 팝업
  const [isEditor, setIsEditor] = useState(false);

  // 잘린 이미지
  const [croppedImage, setCroppedImage] = useState("");
  const croppedImageRef = useRef<ReactCropperElement>(null);

  // // 이미지를 업로드 했을 때 실행
  const uploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = originalImageRef.current?.files;
    if (files && files.length) {
      const fileURL = URL.createObjectURL(files[0]);
      // 자를 이미지
      setInputImageUrl(fileURL);
      // editor 켜기
      setIsEditor(true);
      // 원래 이름 저장하기
      setOriginalFileName(files[0].name);
    }
  };

  const cropperHandler = () => {
    if (typeof croppedImageRef.current?.cropper !== "undefined") {
      const tempCroppedCanvas =
        croppedImageRef.current?.cropper.getCroppedCanvas({
          maxHeight: 420,
          maxWidth: 700,
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
      setInputImageUrl(tempCroppedImage);
    }
  };

  const editorHandler = () => {
    setIsEditor(false);
    setInputImageUrl("");
    if (originalImageRef.current) {
      originalImageRef.current.value = "";
    }
  };

  return (
    <>
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
                src={inputImgUrl}
                style={{
                  maxHeight: "60vh",
                  maxWidth: "90vw",
                  // overflow: "auto",
                }}
                minCropBoxHeight={180}
                minCropBoxWidth={300}
                viewMode={0}
                aspectRatio={5 / 3}
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
      <div className="create-deal-img-input-wrapper">
        <label htmlFor="uploadImg" className="file-input-label">
          {!croppedImage ? (
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
              <img src={croppedImage} alt="" />
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
    </>
  );
}
