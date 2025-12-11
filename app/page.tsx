"use client";

import { useEffect, useState } from "react";
import { LoginModal } from "./login/loginModal";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 최초 렌더링 시 localStorage에서 토큰 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // token 존재 여부로 로그인 판단
  }, []);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

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

  return (
    <main className="min-h-screen bg-light p-4">
      <div className="container py-4">

        <header className="position-relative pb-5 text-center">

          {/* 로그인 / 로그아웃 버튼 */}
          {!isLoggedIn ? (
            <button
              onClick={() => setShowLogin(true)}
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

          <h1 className="fw-bold display-5 mb-2 text-dark">Directional</h1>
          <p className="text-dark">게시판 & 데이터 시각화 플랫폼</p>
        </header>

        {/* 기능 섹션 */}
        <section className="row g-4">

          {/* 게시판 카드 */}
          <div className="col-12 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h4 fw-semibold mb-3">📌 게시판 기능</h2>
                <p className="text-muted mb-4">
                  다양한 글을 작성/조회/댓글로 소통할 수 있는 기본 게시판 기능을 제공합니다.
                </p>
                <button
                  className="btn btn-primary rounded-pill px-4 py-2"
                  onClick={() => {
                    if (!requireLogin()) return;
                    alert("게시판 이동! (로그인됨)");
                  }}
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
                <h2 className="h4 fw-semibold mb-3">📊 데이터 시각화 기능</h2>
                <p className="text-muted mb-4">
                  차트, 그래프, 테이블을 활용하여 데이터를 직관적으로 보여줍니다.
                </p>
                <button
                  className="btn btn-success rounded-pill px-4 py-2"
                  onClick={() => {
                    if (!requireLogin()) return;
                    alert("시각화 이동! (로그인됨)");
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
