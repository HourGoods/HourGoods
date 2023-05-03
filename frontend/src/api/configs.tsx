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
  // const accessToken =
  //   "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9NRU1CRVIifV0sImlkIjoxLCJleHAiOjE2ODM2ODI1MzcsImlhdCI6MTY4MzA3NzczNywiZW1haWwiOiJ0ZW1wQGhvdXJnb29kcy5jb20ifQ.w8wEF-nIrUo-OTyUZoVmshLAz-3cO8QCin_uzhgTbvo";

  if (accessToken) {
    tempConfig.headers.Authorization = accessToken;
  } else {
    tempConfig.headers.Authorization = null;
  }
  return tempConfig;
});

// 응답 확인

export { axiosInstance, authInstance };
