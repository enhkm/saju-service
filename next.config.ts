import type { NextConfig } from "next";

/**
 * GitHub Pages(정적 사이트)로 배포하기 위한 설정.
 * PAGES_REPO(저장소 이름)가 있으면 https://<계정>.github.io/<저장소>/ 아래에서 동작하도록 경로 앞부분을 붙인다.
 * 슬래시는 여기서 붙인다(Windows Git Bash 가 "/이름" 형태 환경변수를 파일 경로로 바꾸는 문제 회피).
 * 로컬 개발(npm run dev)에서는 비워 두므로 http://localhost:3000/ 그대로 쓴다.
 */
const repo = process.env.PAGES_REPO?.replace(/^\/+|\/+$/g, "");
const basePath = repo ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
