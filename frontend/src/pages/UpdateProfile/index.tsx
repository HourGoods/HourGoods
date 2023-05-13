import React, { useRef, useState, useCallback, useEffect } from "react";
import Button from "@components/common/Button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useLocation } from "react-router";
import "./index.scss";
import { useRecoilState } from "recoil";
import { UserStateAtom } from "@recoils/user/Atom";
import { memberAPI } from "@api/apis";
import { useNavigate } from "react-router-dom";
import { handleOnKeyPress } from "@utils/handleOnKeyPress";
import uploadProfileImage from "@utils/uploadProfileImage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function index() {
  const [userInfo, setUserInfo] = useRecoilState(UserStateAtom);
  const navigate = useNavigate();

  const [inputImage, setInputImage] = useState({
    file: null,
    filename: "",
  });

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

  const handleButtonClick = () => {
    uploadImageRef.current?.click();
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
    const regex = /^[a-zA-Z0-9가-힣]{2,16}$/;
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
    try {
      // 이미지 업로드하여 이미지 주소 받아오기
      const imageUrl = await uploadProfileImage(
        inputImage.file,
        inputImage.filename
      );
      if (imageUrl) {
        console.log("받아온 이미지 주소", imageUrl);
        console.log(inputImage.file);
        console.log(inputImage.filename);
        // POST API 요청
        const result = memberAPI.editUser({ ...userInfo, imageUrl });
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
    } catch (error) {
      console.log(error);
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
      <div className="upper">
        <div className="updateprofile-container">
          <div className="updateprofile-contents-container">
            <div className="updateprofile-contents-container-desktop">
              <label htmlFor="uploadImg">
                <h2>회원정보 수정💝</h2>
                <div className="updateprofile-contents-container-wrapper">
                  {/* <img src={userInfo.imageUrl} alt="프로필 사진" /> */}
                  {!uploadedImage ? (
                    <img src={userInfo.imageUrl} alt="프로필 사진" />
                  ) : (
                    <img src={uploadedImage} alt="프로필 사진" />
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
                    onKeyPress={nicknameChecker}
                  />
                  <button type="button" onClick={nicknameChecker}>
                    {fromMy ? "변경" : "중복 확인"}
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
                    한글로만 특수문자와 공백 없이 2~10자로 입력해주세요.
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
