/* eslint-disable react/react-in-jsx-scope */
import AWS from "aws-sdk";

export default function uploadProfileImage(
  file: any,
  filename: any,
  nickname: string
) {
  const region = "ap-northeast-2";
  const bucket = "a204-hourgoods-bucket";

  const today = Date.now();
  const fileType = filename.slice(-5, filename.length);

  AWS.config.update({
    region,
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  });

  // S3 SDK에 내장된 업로드 함수
  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: bucket, // 업로드할 대상 버킷명
      Key: `image/member-profile/${today}${nickname}${fileType}`, // 업로드 위치와 업로드할 파일명, 유저 프로필은 경로를 image/member-profile/로 넣어주세요
      Body: file, // 업로드할 파일 객체
    },
  });

  return upload
    .promise()
    .then((res) => {
      const imageUrl = res.Location;
      return imageUrl;
    })
    .catch((err) => {
      console.log(err);
      const imageUrl = null;
      return imageUrl;
    });
}
