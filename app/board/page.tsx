"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Button, Form, Modal, Badge } from "react-bootstrap";
import Header from "../components/Header";
import { apifetch } from "../api/apifetch";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import PostWriteModal from "../components/PostWriteModal";
import EditPostModal from "../components/EditPostModal";

type Post = {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  createdAt: string;
};

// 네트워크 오류나 응답 형식 불일치 시 기존 더미 데이터로 안전하게 폴백함
async function fetchPosts(cursor?: string, opts?: { search?: string; sort?: string; order?: string }) {
  // 간단한 로딩 시뮬레이션을 유지
  await new Promise((r) => setTimeout(r, 300));

  try {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (opts?.search) params.append("search", opts.search);
    if (opts?.sort) params.append("sort", opts.sort);
    if (opts?.order) params.append("order", opts.order);

    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await apifetch({ url: `/api/proxy/posts${qs}`, method: "GET" });

    if (res && Array.isArray(res.items)) {
      return {
        items: res.items,
        nextCursor: res.nextCursor || null,
        prevCursor: res.prevCursor || null,
      };
    }

    console.warn("fetchPosts: unexpected API response, falling back to dummy", res);
  } catch (err) {
    console.warn("fetchPosts API error, falling back to dummy:", err);
  }

  // 폴백 더미 데이터
  return {
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `post_${cursor ?? "start"}_${Date.now()}_${i}`,
      userId: "u_" + i,
      title: `Sample Post (${cursor ?? "start"}) #${i}`,
      body: "Hello world " + i,
      category: i % 2 ? "NOTICE" : "FREE",
      tags: ["tag1", "tag2"],
      createdAt: new Date().toISOString(),
    })),
    nextCursor: cursor ? cursor + "_next" : "cursor_1",
  };
}

export default function BoardPage() {
  // 게시글 작성 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  // 전체 삭제 확인 모달 상태
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // 이벤트 핸들러(스크롤 등)에서 최신 상태값을 참조하기 위한 ref
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const scrollThrottleRef = useRef<number | null>(null);
  const initRef = useRef(false);

  // 스크롤 가능한 컨테이너 ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // 컬럼 정의
  const columns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 150,
      },
      {
        accessorKey: "title",
        header: "제목",
        size: 250,
        cell: (info) => {
          const row = info.row.original as Post;
          return (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setEditId(row.id);
                setShowEditModal(true);
              }}
            >
              {String(info.getValue())}
            </a>
          );
        },
      },
      {
        accessorKey: "category",
        header: "카테고리",
        size: 80,
        cell: (info) => {
          const category = info.getValue() as string;
          const variantMap: Record<string, string> = {
            NOTICE: "info",
            QNA: "warning",
            FREE: "success",
          };
          return <Badge bg={variantMap[category] || "secondary"}>{category}</Badge>;
        },
      },
      {
        accessorKey: "tags",
        header: "태그",
        size: 150,
        cell: (info) => {
          const tags = info.getValue() as string[];
          return (
            <div className="d-flex gap-1 flex-wrap">
              {tags.map((tag) => (
                <Badge key={tag} bg="dark">
                  #{tag}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "작성일",
        size: 180,
      },
    ],
    []
  );

  const columnLabels: Record<string, string> = {
    id: "ID",
    title: "제목",
    category: "카테고리",
    tags: "태그",
    createdAt: "작성일",
  };

  // react-table 초기화
  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
  });

  // 데이터 최초 로드 + 무한 스크롤 처리
  const loadMore = useMemo(() => async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetchPosts(cursor ?? undefined, { search, sort, order });
      setPosts((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor || null);
      setHasMore(Boolean(res.nextCursor));
    } catch (err) {
      console.error("loadMore error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor, search, sort, order]);

  // 전체 삭제 함수
  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const res = await apifetch({ url: "/api/proxy/posts", method: "DELETE" });
      console.log("Delete all response:", res);
      setPosts([]);
      setCursor(null);
      setHasMore(true);
      alert("모든 게시글이 삭제되었습니다.");
    } catch (err) {
      console.error("Delete all error:", err);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // 초기 로드 (페이지 처음 진입 시 한 번만)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      setLoading(true);
      try {
        const res = await fetchPosts(undefined, { search: "", sort: "createdAt", order: "desc" });
        setPosts(res.items);
        setCursor(res.nextCursor || null);
        setHasMore(Boolean(res.nextCursor));
      } catch (err) {
        console.error("Initial load error:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // search, sort, order 변경 시 목록 재조회
  useEffect(() => {
    if (!initRef.current) return;

    (async () => {
      setPosts([]);
      setCursor(null);
      setHasMore(true);
      setLoading(true);
      try {
        const res = await fetchPosts(undefined, { search, sort, order });
        setPosts(res.items);
        setCursor(res.nextCursor || null);
        setHasMore(Boolean(res.nextCursor));
      } catch (err) {
        console.error("Filter/sort error:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [search, sort, order]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // 스크롤 리스너는 한 번만 등록함(중복 등록 방지)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // 내부 스크롤 핸들러 — 컨테이너 스크롤이 바닥에 도달했는지 검사
  const handleScroll = () => {
    // 150ms 단위로 throttle 처리
    if (scrollThrottleRef.current) return;
    scrollThrottleRef.current = window.setTimeout(() => {
      scrollThrottleRef.current && clearTimeout(scrollThrottleRef.current);
      scrollThrottleRef.current = null;

      const el = scrollRef.current;
      if (!el) return;

      // ref를 사용해 최신 상태를 확인함
      if (loadingRef.current) return;
      if (!hasMoreRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadMore();
      }
    }, 150) as unknown as number;
  };


  return (
    <main className="min-h-screen bg-light p-4">
      <div className="container py-4">

        <Header />

        {/* 상단 헤더 */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">📌 게시판</h2>

          <div className="d-flex gap-2">
            <Link href="/" className="btn btn-secondary rounded-pill px-4">
              ◀ 메인으로 돌아가기
            </Link>
          </div>
        </div>

        {/* 검색 및 정렬 컨트롤 */}
        <Form className="d-flex align-items-center gap-2 mb-3">
          <Form.Control
            type="search"
            placeholder="검색어 입력"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setSearch(searchInput);
              }
            }}
            style={{ width: 400 }}
          />
          <Button variant="outline-secondary" onClick={() => setSearch(searchInput)}>
            검색
          </Button>

          <Form.Select value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 200 }}>
            <option value="createdAt">정렬: 작성일</option>
            <option value="title">정렬: 제목</option>
          </Form.Select>

          <Form.Select value={order} onChange={(e) => setOrder(e.target.value)} style={{ width: 200 }}>
            <option value="desc">내림차순</option>
            <option value="asc">오름차순</option>
          </Form.Select>
        </Form>

        {/* 컬럼 토글 UI + 게시글 작성 버튼 */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <strong>컬럼 표시 설정:</strong>
            <div className="d-flex gap-3 mt-2">
              {table.getAllLeafColumns().map((col) => (
                <label key={col.id} className="d-flex align-items-center gap-1">
                  <input
                    type="checkbox"
                    checked={col.getIsVisible()}
                    onChange={col.getToggleVisibilityHandler()}
                  />
                  {columnLabels[col.id] ?? col.id}
                </label>
              ))}
            </div>
          </div>

          {/* 우측 버튼들 */}
          <div className="d-flex gap-2">
            <Button variant="danger" className="rounded-pill px-4" onClick={() => setShowDeleteConfirm(true)}>
              🗑️ 전체 삭제
            </Button>
            <Button variant="primary" className="rounded-pill px-4" onClick={() => setShowModal(true)}>
              ✏️ 게시글 작성
            </Button>
          </div>
        </div>

        {/* 테이블 */}
        <div
          ref={scrollRef}
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            border: "1px solid #ddd",
          }}
        >
          <table className="table table-bordered table-hover" style={{ width: "100%" }}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        position: "relative",
                        userSelect: "none",
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {/* 사이즈 조절 핸들 */}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          height: "100%",
                          width: "6px",
                          cursor: "col-resize",
                          background: header.column.getIsResizing() ? "#888" : "transparent",
                        }}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* 무한 스크롤 상태 표시 (컨테이너 내부 바닥 근처에 표시됨) */}
          <div className="text-center py-3 bg-white">
            {loading ? "로딩중..." : "스크롤을 내려 더 보기"}
          </div>
        </div>

        {/* 게시글 작성 모달 */}
        <PostWriteModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={() => {
            // 게시글 작성 성공 후 목록 새로고침
            setPosts([]);
            setCursor(null);
            setHasMore(true);
            loadMore();
          }}
        />

        {/* 게시글 수정 모달 */}
        <EditPostModal
          show={showEditModal}
          id={editId}
          onClose={() => {
            setShowEditModal(false);
            setEditId(null);
          }}
          onUpdated={() => {
            setPosts([]);
            setCursor(null);
            setHasMore(true);
            loadMore();
          }}
        />

        {/* 전체 삭제 확인 모달 */}
        <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>전체 삭제 확인</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            정말로 모든 게시글을 삭제하시겠습니까?<br />
            이 작업은 되돌릴 수 없습니다.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteAll} disabled={deleting}>
              {deleting ? "삭제 중..." : "삭제"}
            </Button>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </main>
  );
}
