export const apifetch = async ({
  url,
  method = "GET",
  data = null,
}: {
  url: string;
  method?: string;
  data?: any;
}) => {
  try {
    // 클라이언트 환경에서만 실행 가능
    if (typeof window === "undefined") {
      return Promise.reject({ message: "apifetch는 클라이언트 환경에서만 사용 가능합니다" });
    }

    const token = localStorage.getItem("token");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
      credentials: "include",
      mode: "cors",
    };

    // Body 처리 (GET 제외)
    if (method !== "GET" && data) {
      if (data instanceof FormData) {
        delete headers["Content-Type"];
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }

    // Authorization 토큰 포함
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("Token is null, Authorization header NOT set");
    }

    // 개발 환경에서 프록시 대신 외부 API로 직접 호출하면
    // 로컬 프록시/헤더 변환 문제를 우회할 수 있음.
    const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
    let finalUrl = url;
    if (isLocalhost && typeof url === "string" && url.startsWith("/api/proxy")) {
      // '/api/proxy/posts' -> 'https://fe-hiring-rest-api.vercel.app/posts'
      finalUrl = "https://fe-hiring-rest-api.vercel.app" + url.replace("/api/proxy", "");
      console.log("🔁 dev bypass: calling external API directly:", finalUrl);

      // 외부 도메인으로의 브라우저 요청에서는 credentials: 'include' 로 인해
      // 서버의 CORS 응답이 실패할 수 있음. 개발용 우회 시 자격증명 제외.
      options.credentials = "omit";
    }

    const response = await fetch(finalUrl, options);

    // JSON이 아니면 에러
    const json = await response.json().catch(() => null);

    if (!response.ok) {
      return Promise.reject(json || { message: "Unknown error" });
    }

    return json;
  } catch (err) {
    return Promise.reject(err);
  }
};