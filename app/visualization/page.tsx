"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { Button, Modal } from "react-bootstrap";
import dynamic from "next/dynamic";
import { apifetch } from "../api/apifetch";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function VisualizationPage() {
  const [showModal, setShowModal] = useState<string | null>(null);

  const [weeklyMoodTrend, setWeeklyMoodTrend] = useState<any[]>([]);
  const [popularSnackBrands, setPopularSnackBrands] = useState<any[]>([]);
  const [weeklyWorkoutTrend, setWeeklyWorkoutTrend] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const openModal = async (type: string) => {
    setShowModal(type);

    if (type === "bar") {
      // 바 차트 데이터 조회
      setLoading(true);
      try {
        const barMock1 = await apifetch({ url: `/api/proxy/mock/weekly-mood-trend`, method: "GET" });
        setWeeklyMoodTrend(barMock1);
        const barMock2 = await apifetch({ url: `/api/proxy/mock/popular-snack-brands`, method: "GET" });
        setPopularSnackBrands(barMock2);
      } catch (e) {
        console.error("API Error:", e);
      } finally {
        setLoading(false);
      }
    } else if (type === "donut") {
      // 도넛 차트 데이터 조회
      setLoading(true);
      try {
        const donutMock1 = await apifetch({ url: `/api/proxy/mock/weekly-mood-trend`, method: "GET" });
        setWeeklyMoodTrend(donutMock1);
        const donutMock2 = await apifetch({ url: `/api/proxy/mock/popular-snack-brands`, method: "GET" });
        setPopularSnackBrands(donutMock2);
      } catch (e) {
        console.error("API Error:", e);
      } finally {
        setLoading(false);
      }
    } else if (type === "stacked") {
      // 스택형 바 차트 데이터 조회
      setLoading(true);
      try {
        const stackedMock1 = await apifetch({ url: `/api/proxy/mock/weekly-mood-trend`, method: "GET" });
        setWeeklyMoodTrend(stackedMock1);
        const stackedMock2 = await apifetch({ url: `/api/proxy/mock/weekly-workout-trend`, method: "GET" });
        setWeeklyWorkoutTrend(stackedMock2);
      } catch (e) {
        console.error("API Error:", e);
      } finally {
        setLoading(false);
      }
    } else if (type === "area") {
      // 면적 차트 데이터 조회
      setLoading(true);
      try {
        const areaMock1 = await apifetch({ url: `/api/proxy/mock/weekly-mood-trend`, method: "GET" });
        setWeeklyMoodTrend(areaMock1);
        const areaMock2 = await apifetch({ url: `/api/proxy/mock/weekly-workout-trend`, method: "GET" });
        setWeeklyWorkoutTrend(areaMock2);
      } catch (e) {
        console.error("API Error:", e);
      } finally {
        setLoading(false);
      }
    } else if (type === "multiline") {
      // 멀티라인 차트 데이터 조회 (추가 예정)
    }
  };

  const closeModal = () => {
    setShowModal(null);
  };

  return (
    <main className="min-h-screen bg-light p-4">
      <div className="container py-4">
        <Header />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">📊 데이터 시각화</h2>
          <div>
            <Link href="/" className="btn btn-secondary rounded-pill px-4">
              ◀ 메인으로 돌아가기
            </Link>
          </div>
        </div>

        <div className="card shadow-sm mb-4 p-3">
          <h5 className="fw-bold mb-3">차트 선택</h5>

          <div className="row g-3">
            <div className="col-6">
              <Button variant="primary" className="btn-lg w-100 py-3" onClick={() => openModal("bar")}>바 차트</Button>
            </div>
            <div className="col-6">
              <Button variant="success" className="btn-lg w-100 py-3" onClick={() => openModal("donut")}>도넛 차트</Button>
            </div>

            <div className="col-6">
              <Button variant="warning" className="btn-lg w-100 py-3" onClick={() => openModal("stacked")}>스택형 바 차트</Button>
            </div>
            <div className="col-6">
              <Button variant="info" className="btn-lg w-100 py-3" onClick={() => openModal("area")}>면적 차트</Button>
            </div>

            <div className="col-6">
              <Button variant="dark" className="btn-lg w-100 py-3" onClick={() => openModal("multiline")}>멀티라인 차트</Button>
            </div>
          </div>
        </div>

        {/* 바 차트 모달 */}
        <Modal show={showModal === "bar"} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>바 차트</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            {/* Weekly Mood Trend */}
            <h6 className="fw-bold mb-2">주간 무드 트렌드</h6>
            <div style={{ height: 300 }} className="mb-4 d-flex align-items-center justify-content-center border rounded">
              {loading ? (
                <span className="text-muted">로딩 중...</span>
              ) : weeklyMoodTrend.length > 0 ? (
                <ReactApexChart
                  type="bar"
                  height={300}
                  series={[
                    { name: "Happy", data: weeklyMoodTrend.map(d => d.happy) },
                    { name: "Tired", data: weeklyMoodTrend.map(d => d.tired) },
                    { name: "Stressed", data: weeklyMoodTrend.map(d => d.stressed) }
                  ]}
                  options={{
                    chart: { stacked: false, toolbar: { show: false } },
                    xaxis: { categories: weeklyMoodTrend.map(d => d.week) },
                    plotOptions: { bar: { borderRadius: 4 } }
                  }}
                />
              ) : (
                <span className="text-muted">데이터 없음</span>
              )}
            </div>

            {/* Popular Snack Brands */}
            <h6 className="fw-bold mb-2">인기 간식 브랜드</h6>
            <div style={{ height: 300 }} className="d-flex align-items-center justify-content-center border rounded">
              {loading ? (
                <span className="text-muted">로딩 중...</span>
              ) : popularSnackBrands.length > 0 ? (
                <ReactApexChart
                  type="bar"
                  height={300}
                  series={[
                    {
                      name: "Share",
                      data: popularSnackBrands.map(d => d.share)
                    }
                  ]}
                  options={{
                    chart: { toolbar: { show: false } },
                    xaxis: { categories: popularSnackBrands.map(d => d.name) },
                    plotOptions: { bar: { borderRadius: 4 } },
                    colors: ["#FF9800"]
                  }}
                />
              ) : (
                <span className="text-muted">데이터 없음</span>
              )}
            </div>
          </Modal.Body>
        </Modal>

        {/* 도넛 차트 모달 */}
        <Modal show={showModal === "donut"} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>도넛 차트</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            {/* Weekly Mood Trend → 전체 감정 비율 */}
            <h6 className="fw-bold mb-2">전체 감정 비율</h6>
            <div style={{ height: 300 }} className="mb-4 d-flex align-items-center justify-content-center border rounded">
              {loading ? (
                <span className="text-muted">로딩 중...</span>
              ) : weeklyMoodTrend.length > 0 ? (
                <ReactApexChart
                  type="donut"
                  height={300}
                  series={[
                    weeklyMoodTrend.reduce((sum, d) => sum + d.happy, 0),
                    weeklyMoodTrend.reduce((sum, d) => sum + d.tired, 0),
                    weeklyMoodTrend.reduce((sum, d) => sum + d.stressed, 0)
                  ]}
                  options={{
                    labels: ["Happy", "Tired", "Stressed"],
                    chart: { toolbar: { show: false } }
                  }}
                />
              ) : (
                <span className="text-muted">데이터 없음</span>
              )}
            </div>

            {/* Popular Snack Brands → 브랜드 점유율 */}
            <h6 className="fw-bold mb-2">간식 브랜드 점유율</h6>
            <div style={{ height: 300 }} className="d-flex align-items-center justify-content-center border rounded">
              {loading ? (
                <span className="text-muted">로딩 중...</span>
              ) : popularSnackBrands.length > 0 ? (
                <ReactApexChart
                  type="donut"
                  height={300}
                  series={popularSnackBrands.map(b => b.share)}
                  options={{
                    labels: popularSnackBrands.map(b => b.name),
                    chart: { toolbar: { show: false } }
                  }}
                />
              ) : (
                <span className="text-muted">데이터 없음</span>
              )}
            </div>

          </Modal.Body>
        </Modal>

        {/* 스택형 바 차트 모달 */}
        <Modal show={showModal === "stacked"} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>스택형 바 차트</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            {/* Weekly Mood Trend Stack Chart */}
            <h6 className="fw-bold mb-2">주간 무드 스택형 바 차트</h6>
            <div
              style={{ height: 350 }}
              className="d-flex align-items-center justify-content-center border rounded"
            >
              {loading ? (
                <span className="text-muted">로딩 중...</span>
              ) : weeklyMoodTrend.length > 0 ? (
                <ReactApexChart
                  type="bar"
                  height={330}
                  series={[
                    { name: "Happy", data: weeklyMoodTrend.map((d) => d.happy) },
                    { name: "Tired", data: weeklyMoodTrend.map((d) => d.tired) },
                    { name: "Stressed", data: weeklyMoodTrend.map((d) => d.stressed) }
                  ]}
                  options={{
                    chart: {
                      stacked: true,
                      toolbar: { show: false }
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        borderRadius: 4
                      }
                    },
                    xaxis: {
                      categories: weeklyMoodTrend.map((d) => d.week)
                    },
                    yaxis: {
                      title: {
                        text: "백분율 (%)"
                      },
                      max: 100
                    },
                    legend: {
                      position: "top"
                    },
                    fill: {
                      opacity: 1
                    }
                  }}
                />
              ) : (
                <span className="text-muted">데이터 없음</span>
              )}
            </div>

            {/* Weekly Workout Trend Stack Chart */}
            <h6 className="fw-bold mt-4 mb-2">주간 운동량 스택형 바 차트</h6>
            <div
              style={{ height: 350 }}
              className="d-flex align-items-center justify-content-center border rounded"
            >
              {loading ? (
                <span className="text-muted">로딩 중...</span>
              ) : weeklyWorkoutTrend.length > 0 ? (
                <ReactApexChart
                  type="bar"
                  height={330}
                  series={[
                    { name: "Running", data: weeklyWorkoutTrend.map((d) => d.running) },
                    { name: "Cycling", data: weeklyWorkoutTrend.map((d) => d.cycling) },
                    { name: "Stretching", data: weeklyWorkoutTrend.map((d) => d.stretching) }
                  ]}
                  options={{
                    chart: {
                      stacked: true,
                      toolbar: { show: false }
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        borderRadius: 4
                      }
                    },
                    xaxis: {
                      categories: weeklyWorkoutTrend.map((d) => d.week)
                    },
                    yaxis: {
                      title: {
                        text: "백분율 (%)"
                      },
                      max: 100
                    },
                    legend: {
                      position: "top"
                    },
                    fill: {
                      opacity: 1
                    }
                  }}
                />
              ) : (
                <span className="text-muted">데이터 없음</span>
              )}
            </div>

          </Modal.Body>
        </Modal>

        {/* 면적 차트 모달 */}
        <Modal show={showModal === "area"} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>면적 차트</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            {/* Weekly Mood Trend Area Chart */}
            <h6 className="fw-bold mb-2">주간 무드 면적 차트</h6>
            <div
              style={{ height: 350 }}
              className="d-flex align-items-center justify-content-center border rounded mb-4"
            >
              {loading ? (
                <span className="text-muted">로딩 중...</span>
              ) : weeklyMoodTrend.length > 0 ? (
                <ReactApexChart
                  type="area"
                  height={330}
                  series={[
                    { name: "Happy", data: weeklyMoodTrend.map((d) => d.happy) },
                    { name: "Tired", data: weeklyMoodTrend.map((d) => d.tired) },
                    { name: "Stressed", data: weeklyMoodTrend.map((d) => d.stressed) }
                  ]}
                  options={{
                    chart: { toolbar: { show: false } },
                    dataLabels: { enabled: false },
                    stroke: { curve: "smooth" },
                    xaxis: { categories: weeklyMoodTrend.map((d) => d.week) },
                    yaxis: {
                      title: { text: "백분율 (%)" },
                      max: 100
                    },
                    fill: { opacity: 0.4 },
                    legend: { position: "top" }
                  }}
                />
              ) : (
                <span className="text-muted">데이터 없음</span>
              )}
            </div>

            {/* Weekly Workout Trend Area Chart */}
            <h6 className="fw-bold mb-2">주간 운동량 면적 차트</h6>
            <div
              style={{ height: 350 }}
              className="d-flex align-items-center justify-content-center border rounded"
            >
              {loading ? (
                <span className="text-muted">로딩 중...</span>
              ) : weeklyWorkoutTrend.length > 0 ? (
                <ReactApexChart
                  type="area"
                  height={330}
                  series={[
                    { name: "Running", data: weeklyWorkoutTrend.map((d) => d.running) },
                    { name: "Cycling", data: weeklyWorkoutTrend.map((d) => d.cycling) },
                    { name: "Stretching", data: weeklyWorkoutTrend.map((d) => d.stretching) }
                  ]}
                  options={{
                    chart: { toolbar: { show: false } },
                    dataLabels: { enabled: false },
                    stroke: { curve: "smooth" },
                    xaxis: { categories: weeklyWorkoutTrend.map((d) => d.week) },
                    yaxis: {
                      title: { text: "백분율 (%)" },
                      max: 100
                    },
                    fill: { opacity: 0.4 },
                    legend: { position: "top" }
                  }}
                />
              ) : (
                <span className="text-muted">데이터 없음</span>
              )}
            </div>

          </Modal.Body>
        </Modal>

        {/* 멀티라인 차트 모달 */}
        <Modal show={showModal === "multiline"} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>멀티라인 차트</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ height: 300 }} className="d-flex align-items-center justify-content-center border rounded">
              멀티라인 차트 영역 (추가 예정)
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </main>
  );
}
