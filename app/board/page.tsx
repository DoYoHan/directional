"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button, Table } from "react-bootstrap";
import Header from "../components/Header";

export default function BoardPage() {
  // 더미 데이터
  const dummyPosts = [
    {
      id: "1",
      userId: "user123",
      title: "첫 번째 공지사항입니다.",
      body: "사이트 오픈을 축하드립니다!",
      category: "NOTICE",
      tags: ["공지"],
      createdAt: "2025-01-01",
    },
    {
      id: "2",
      userId: "user456",
      title: "Q&A 테스트 게시물",
      body: "이 페이지는 예시로 보여지는 게시글입니다.",
      category: "QNA",
      tags: ["질문", "테스트"],
      createdAt: "2025-01-05",
    },
    {
      id: "3",
      userId: "user789",
      title: "자유 게시판 첫 글",
      body: "아무 말 대잔치 시작",
      category: "FREE",
      tags: ["자유", "잡담"],
      createdAt: "2025-01-10",
    },
  ];

  return (
    <main className="min-h-screen bg-light p-4">
      <div className="container py-4">

        <Header />

        {/* 상단 헤더 */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">📌 게시판</h2>

          <Link href="/" className="btn btn-outline-secondary rounded-pill px-4">
            ◀ 메인으로 돌아가기
          </Link>
        </div>

        {/* 게시판 테이블 */}
        <Table bordered hover className="bg-white shadow-sm">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "8%" }}>번호</th>
              <th style={{ width: "45%" }}>제목</th>
              <th style={{ width: "12%" }}>카테고리</th>
              <th style={{ width: "20%" }}>태그</th>
              <th style={{ width: "15%" }}>작성일</th>
            </tr>
          </thead>

          <tbody>
            {dummyPosts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>

                {/* 제목 */}
                <td className="fw-semibold text-primary" style={{ cursor: "pointer" }}>
                  {post.title}
                </td>

                {/* 카테고리 */}
                <td>
                  <Badge bg={
                    post.category === "NOTICE"
                      ? "warning"
                      : post.category === "QNA"
                        ? "info"
                        : "secondary"
                  }>
                    {post.category}
                  </Badge>
                </td>

                {/* 태그들 */}
                <td>
                  {post.tags.map((tag, i) => (
                    <Badge key={i} bg="dark" className="me-1">
                      #{tag}
                    </Badge>
                  ))}
                </td>

                {/* 날짜 */}
                <td>{post.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </main>
  );
}
