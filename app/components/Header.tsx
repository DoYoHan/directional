"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 초기 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);

    router.push("/"); // 메인으로 이동
  };

  return (
    <header className="position-relative pb-5 text-center">

      {/* 로그인/로그아웃 버튼 */}
      {!isLoggedIn ? (
        <button
          onClick={() => router.push("/")}
          className="btn btn-dark rounded-pill px-4 py-2 position-absolute top-0 end-0"
        >
          로그인
        </button>
      ) : (
        <button
          onClick={handleLogout}
          className="btn btn-danger rounded-pill px-4 py-2 position-absolute top-0 end-0"
        >
          로그아웃
        </button>
      )}

      {/* 로고 클릭 시 메인 이동 */}
      <h1
        className="fw-bold display-5 mb-2 text-dark"
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/")}
      >
        Directional
      </h1>

      <p className="text-dark">게시판 & 데이터 시각화 플랫폼</p>
    </header>
  );
}
