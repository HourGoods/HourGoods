import axios from "axios";

export interface requestConfig {
  params?: object;
  headers?: object;
  encType?: string;
  data?: object;
}

const axiosInstance = axios.create({
  baseURL: "https://k8a204.p.ssafy.io/api/",
});

const authInstance = axios.create({
  baseURL: "https://k8a204.p.ssafy.io/api/",
});

// 요청 헤더에 token 추가
authInstance.interceptors.request.use((config) => {
  const tempConfig = config;
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    tempConfig.headers.Authorization = accessToken;
  } else {
    tempConfig.headers.Authorization = null;
  }
  return tempConfig;
});

// 응답 확인

export { axiosInstance, authInstance };
