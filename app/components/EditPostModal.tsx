"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Button, Badge } from "react-bootstrap";
import { apifetch } from "../api/apifetch";

type Props = {
  show: boolean;
  id?: string | null;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditPostModal({ show, id, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("NOTICE");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const bannedWords = ["캄보디아", "프놈펜", "불법체류", "텔레그램"];

  useEffect(() => {
    if (!show || !id) return;
    setLoading(true);
    (async () => {
      try {
        const res = await apifetch({ url: `/api/proxy/posts/${id}`, method: "GET" });
        if (res) {
          setTitle(res.title || "");
          setBody(res.body || "");
          setCategory(res.category || "NOTICE");
          setTags(Array.isArray(res.tags) ? res.tags : []);
          setCreatedAt(res.createdAt || null);
        }
      } catch (err) {
        console.error("GET post error:", err);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        onClose();
      } finally {
        setLoading(false);
      }
    })();
  }, [show, id]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (t.length > 24) return alert("태그는 24자 이내여야 합니다.");
    if (tags.includes(t)) return alert("이미 존재하는 태그입니다.");
    if (tags.length >= 5) return alert("태그는 최대 5개까지 가능합니다.");
    setTags([...tags, t]);
    setTagInput("");
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const handleUpdate = async () => {
    if (!id) return;
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!body.trim()) return alert("본문을 입력해주세요.");

    const found = bannedWords.filter((word) => body.includes(word));
    if (found.length > 0) {
      return alert(`금칙어 "${found.join(", ")}" 가 포함되어 있어 수정에 실패했습니다.`);
    }

    setSaving(true);
    try {
      await apifetch({
        url: `/api/proxy/posts/${id}`,
        method: "PATCH",
        data: { title, body, category, tags },
      });
      alert("게시글이 수정되었습니다.");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("PATCH error:", err);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirmDelete()) return;
    setDeleting(true);
    try {
      await apifetch({ url: `/api/proxy/posts/${id}`, method: "DELETE" });
      alert("게시글이 삭제되었습니다.");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("DELETE error:", err);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const confirmDelete = () => {
    // additional client-side check can be added here; keep for readability
    return true;
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      {/* 오버레이: 삭제 확인 모달이 활성화되면 편집 모달을 어둡게 표시 */}
      {showDeleteConfirm && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 1040,
          }}
        />
      )}
      <Modal.Header closeButton>
        <Modal.Title>✏️ 게시글 수정</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div>불러오는 중...</div>
        ) : (
          <>
            <Form.Group className="mb-3">
              <Form.Label>게시글 제목 (최대 80자)</Form.Label>
              <Form.Control
                type="text"
                value={title}
                maxLength={80}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>게시글 본문 (최대 2000자)</Form.Label>
              <Form.Control as="textarea" rows={5} value={body} maxLength={2000} onChange={(e) => setBody(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>카테고리</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="NOTICE">NOTICE</option>
                <option value="QNA">QNA</option>
                <option value="FREE">FREE</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>태그 (최대 5개)</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control type="text" value={tagInput} maxLength={24} onChange={(e) => setTagInput(e.target.value)} />
                <Button variant="secondary" onClick={addTag}>추가</Button>
              </div>
            </Form.Group>

            <div className="mb-3">
              {tags.map((t) => (
                <Badge key={t} bg="dark" className="me-2" style={{ cursor: 'pointer' }} onClick={() => removeTag(t)}>
                  #{t} ✕
                </Badge>
              ))}
            </div>

            <Form.Group className="mb-3">
              <Form.Label>작성일</Form.Label>
              <Form.Control type="text" value={createdAt ? new Date(createdAt).toLocaleString() : ""} disabled />
            </Form.Group>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={saving || loading || deleting}
        >
          {deleting ? "삭제중..." : "삭제"}
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={saving || loading || deleting}>
          {saving ? "수정중..." : "수정"}
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={saving || deleting}>
          닫기
        </Button>
      </Modal.Footer>

      {/* 삭제 확인 모달 */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>게시글 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          정말로 이 게시글을 삭제하시겠습니까?<br />
          이 작업은 되돌릴 수 없습니다.</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "삭제중..." : "삭제"}
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
}
