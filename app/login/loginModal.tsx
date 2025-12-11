"use client";

import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export function LoginModal({
  show,
  onClose,
  onSuccess,
}: {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 모달 닫힐 때 모든 입력값 초기화
  const handleClose = () => {
    setEmail("");
    setPassword("");
    setErrorMessage("");
    onClose();
  };

  const handleLogin = async () => {
    setErrorMessage("");

    // 유효성 검사
    if (!email.trim()) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    } else if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });


      const data = await res.json();
      console.log("로그인 결과: ", data);

      if (data.token) {
        localStorage.setItem("token", data.token); // 토큰 저장
        localStorage.setItem("user", JSON.stringify(data.user)); // 사용자 정보 저장

        handleClose(); // 로그인 성공 시 초기화 후 닫기
        onSuccess(); // 로그인 성공 → 부모에 알림
        return;
      }

      setErrorMessage("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
    } catch (error) {
      console.error(error);
      setErrorMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>로그인</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" className="rounded-pill px-4" onClick={handleLogin}>
          로그인
        </Button>
        <Button variant="secondary" className="rounded-pill px-4" onClick={handleClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
