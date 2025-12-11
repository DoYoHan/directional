import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2">Directional</h1>
          <p className="text-gray-600">게시판 & 데이터 시각화 플랫폼</p>
        </header>

        {/* Category Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 게시판 */}
          <div className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-2xl font-semibold mb-4">📌 게시판 기능</h2>
            <p className="text-gray-600 text-sm mb-6">
              다양한 글을 작성/조회/댓글로 소통할 수 있는 기본 게시판 기능을 제공합니다.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              게시판 바로가기
            </button>
          </div>

          {/* 데이터 시각화 */}
          <div className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-2xl font-semibold mb-4">📊 데이터 시각화 기능</h2>
            <p className="text-gray-600 text-sm mb-6">
              차트, 그래프, 테이블을 활용하여 데이터를 직관적으로 보여줍니다.
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
              시각화 바로가기
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
