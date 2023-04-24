// 노드 path 모듈을 가져온 뒤 Alias path를 작성합니다.
// 대게 src 아래의 폴더들을 전부 작성해주는게 국롤입니다.
// 참고 블로그: https://lasbe.tistory.com/151#%F0%9F%93%8C_craco.config.js_%EC%84%A4%EC%A0%95%ED%8C%8C%EC%9D%BC_%EC%83%9D%EC%84%B1

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@components": path.resolve(__dirname, "src/components"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@apis": path.resolve(__dirname, "src/APIs"),
    },
  },
};

// export const webpack = {
//   alias: {
//     // "@hooks": resolve(__dirname, "src/hooks"),
//     "@pages": resolve(__dirname, "src/Pages"),
//     "@components": resolve(__dirname, "src/Components"),
//     "@assets": resolve(__dirname, "src/assets"),
//     "@stores": resolve(__dirname, "src/stores"),
//     "@styles": resolve(__dirname, "src/Styles"),
//   },
// };
