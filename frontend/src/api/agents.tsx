import { AxiosResponse } from "axios";
import { requestConfig, axiosInstance, authInstance } from "./configs";

const responseBody = (response: AxiosResponse) => {
  return response;
};

const requests = {
  get: (url: string, config?: requestConfig) =>
    axiosInstance.get(url, config).then(responseBody),
  post: (url: string, data: any, config?: requestConfig) =>
    axiosInstance.post(url, data, config).then(responseBody),
  put: (url: string, data: any, config?: requestConfig) =>
    axiosInstance.put(url, data, config).then(responseBody),
  delete: (url: string, config?: requestConfig) =>
    axiosInstance.delete(url, config).then(responseBody),

  // Creator Token 검증
  authGet: (url: string, config?: requestConfig) =>
    authInstance.get(url, config).then(responseBody),
  authPost: (url: string, data: any, config?: requestConfig) =>
    authInstance.post(url, data, config).then(responseBody),
  authPut: (url: string, data: any, config?: requestConfig) =>
    authInstance.put(url, data, config).then(responseBody),
  authDelete: (url: string, config?: requestConfig) =>
    authInstance.delete(url, config).then(responseBody),
};

export default requests;
