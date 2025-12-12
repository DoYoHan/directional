"use client";

import { useEffect, useState } from "react";
import { LoginModal } from "./login/loginModal";
import Header from "./components/Header";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 최초 렌더링 시 localStorage에서 토큰 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // token 존재 여부로 로그인 판단
  }, []);

  // 로그인 성공 후 상태 업데이트용 콜백
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  // 로그인 필요 체크
  const requireLogin = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return false;
    }
    return true;
  };

  // 게시판 이동
  const goToBoard = () => {
    if (!requireLogin()) return;
    router.push("/board");
  };

  return (
    <main className="min-h-screen bg-light p-4">
      <div className="container py-4">

        {/* 공통 헤더 */}
        <Header />

        {/* 기능 섹션 */}
        <section className="row g-4">

          {/* 게시판 카드 */}
          <div className="col-12 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h4 fw-semibold mb-3">📌 게시판</h2>
                <p className="text-muted mb-4">
                  글을 작성/조회/관리할 수 있는 기본 게시판 기능을 제공합니다.
                </p>
                <button
                  className="btn btn-primary rounded-pill px-4 py-2"
                  onClick={goToBoard}
                >
                  게시판 바로가기
                </button>
              </div>
            </div>
          </div>

          {/* 데이터 시각화 카드 */}
          <div className="col-12 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h4 fw-semibold mb-3">📊 데이터 시각화</h2>
                <p className="text-muted mb-4">
                  차트, 그래프, 테이블을 활용하여 데이터를 직관적으로 보여줍니다.
                </p>
                <button
                  className="btn btn-success rounded-pill px-4 py-2"
                  onClick={() => {
                    if (!requireLogin()) return;
                    router.push("/visualization");
                  }}
                >
                  시각화 바로가기
                </button>
              </div>
            </div>
          </div>

        </section>

        {/* 로그인 모달 */}
        <LoginModal
          show={showLogin}
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    </main>
  );
}
