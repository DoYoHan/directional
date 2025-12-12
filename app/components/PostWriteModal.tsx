"use client";

import { useState } from "react";
import { Modal, Form, Button, Badge } from "react-bootstrap";
import { apifetch } from "../api/apifetch";

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    body: string;
    category: string;
    tags: string[];
  }) => void;
};

export default function PostWriteModal({ show, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("NOTICE");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const bannedWords = ["캄보디아", "프놈펜", "불법체류", "텔레그램"];

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    if (tag.length > 24) return alert("태그는 24자 이내여야 합니다.");
    if (tags.length >= 5) return alert("태그는 최대 5개까지 가능합니다.");
    if (tags.includes(tag)) return alert("이미 존재하는 태그입니다.");

    setTags([...tags, tag]);
    setTagInput("");
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const handleSave = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (title.length > 80) return alert("제목은 최대 80자까지 가능합니다.");
    if (!body.trim()) return alert("본문을 입력해주세요.");
    if (body.length > 2000) return alert("본문은 최대 2000자까지 가능합니다.");

    const found = bannedWords.filter((word) => body.includes(word));
    if (found.length > 0) {
      return alert(`금칙어 "${found.join(", ")}" 가 포함되어 있어 저장에 실패했습니다.`);
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    const postData = {
      title,
      body,
      category,
      tags,
    };

    try {
      const data = await apifetch({
        url: "/api/proxy/posts",
        method: "POST",
        data: postData,
      });

      alert("게시글이 성공적으로 저장되었습니다!");

      onSave(data); // 부모 페이지도 갱신 가능하도록 전달
      onClose();

      // 입력값 초기화
      setTitle("");
      setBody("");
      setCategory("NOTICE");
      setTags([]);
      setTagInput("");
    } catch (err: any) {
      console.error("POST 실패:", err);
      const message = err && (err.message || err?.error) ? (err.message || err.error) : "게시글 저장 실패";
      alert(message);
    }
  };


  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>✏️ 게시글 작성</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* 제목 */}
        <Form.Group className="mb-3">
          <Form.Label>게시글 제목 (최대 80자)</Form.Label>
          <Form.Control
            type="text"
            value={title}
            maxLength={80}
            placeholder="제목을 입력하세요"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        {/* 본문 */}
        <Form.Group className="mb-3">
          <Form.Label>게시글 본문 (최대 2000자)</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={body}
            maxLength={2000}
            placeholder="내용을 입력하세요"
            onChange={(e) => setBody(e.target.value)}
          />
        </Form.Group>

        {/* 카테고리 */}
        <Form.Group className="mb-3">
          <Form.Label>카테고리</Form.Label>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="NOTICE">NOTICE</option>
            <option value="QNA">QNA</option>
            <option value="FREE">FREE</option>
          </Form.Select>
        </Form.Group>

        {/* 태그 */}
        <Form.Group className="mb-2">
          <Form.Label>태그 (최대 5개, 24자 이내)</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              maxLength={24}
              placeholder="태그 입력"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <Button variant="secondary" onClick={addTag}>
              추가
            </Button>
          </div>
        </Form.Group>

        {/* 태그 리스트 */}
        <div className="mb-3">
          {tags.map((tag) => (
            <Badge
              key={tag}
              bg="dark"
              className="me-2"
              style={{ cursor: "pointer" }}
              onClick={() => removeTag(tag)}
            >
              #{tag} ✕
            </Badge>
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>저장</Button>
        <Button variant="secondary" onClick={onClose}>닫기</Button>
      </Modal.Footer>
    </Modal>
  );
}
