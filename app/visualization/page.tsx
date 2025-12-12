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
  const [coffeeConsumption, setCoffeeConsumption] = useState<any>({
    teams: []
  });
  const [snackImpact, setSnackImpact] = useState<any>({
    departments: []
  });

  const [loading, setLoading] = useState(false);

  const [moodColors, setMoodColors] = useState(["#008FFB", "#00E396", "#FEB019"]); // Happy / Tired / Stressed
  const [snackColor, setSnackColor] = useState("#FF9800"); // Popular Snack Bar

  const handleMoodColorChange = (index: number, newColor: string) => {
    const updated = [...moodColors];
    updated[index] = newColor;
    setMoodColors(updated);
  };

  const handleSnackColorChange = (newColor: string) => {
    setSnackColor(newColor);
  };


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
      // 멀티라인 차트 데이터 조회
      setLoading(true);
      try {
        const multilineMock1 = await apifetch({ url: `/api/proxy/mock/coffee-consumption`, method: "GET" });
        setCoffeeConsumption(multilineMock1);
        const multilineMock2 = await apifetch({ url: `/api/proxy/mock/snack-impact`, method: "GET" });
        setSnackImpact(multilineMock2);
      } catch (e) {
        console.error("API Error:", e);
      } finally {
        setLoading(false);
      }
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
        <Modal show={showModal === "bar"} onHide={closeModal} centered size="xl">
          <Modal.Header closeButton>
            <Modal.Title>바 차트</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row g-4">
              {/* 왼쪽 차트 */}
              <div className="col-12 col-lg-6">
                <h6 className="fw-bold mb-2">주간 무드 트렌드</h6>
                <div>
                  <div className="d-flex gap-3 mt-2">
                    <div>
                      <input
                        type="color"
                        value={moodColors[0]}
                        onChange={(e) => handleMoodColorChange(0, e.target.value)}
                      />
                      <small> Happy</small>
                    </div>
                    <div>
                      <input
                        type="color"
                        value={moodColors[1]}
                        onChange={(e) => handleMoodColorChange(1, e.target.value)}
                      />
                      <small> Tired</small>
                    </div>
                    <div>
                      <input
                        type="color"
                        value={moodColors[2]}
                        onChange={(e) => handleMoodColorChange(2, e.target.value)}
                      />
                      <small> Stressed</small>
                    </div>
                  </div>
                </div>
                <div style={{ height: 300 }} className="mb-4 d-flex align-items-center justify-content-center border rounded">
                  {loading ? (
                    <span className="text-muted">로딩 중...</span>
                  ) : weeklyMoodTrend.length > 0 ? (
                    <ReactApexChart
                      type="bar"
                      height={300}
                      series={[
                        { name: "Happy", data: weeklyMoodTrend.map(d => d.happy), color: moodColors[0] },
                        { name: "Tired", data: weeklyMoodTrend.map(d => d.tired), color: moodColors[1] },
                        { name: "Stressed", data: weeklyMoodTrend.map(d => d.stressed), color: moodColors[2] }
                      ]}
                      options={{
                        chart: { stacked: false, toolbar: { show: false } },
                        colors: moodColors,
                        xaxis: { categories: weeklyMoodTrend.map(d => d.week) },
                        plotOptions: { bar: { borderRadius: 4 } }
                      }}
                    />
                  ) : (
                    <span className="text-muted">데이터 없음</span>
                  )}
                </div>
              </div>

              {/* 오른쪽 차트 */}
              <div className="col-12 col-lg-6">
                <h6 className="fw-bold mb-2">인기 간식 브랜드</h6>
                <div>
                  <div className="mt-2">
                    <input
                      type="color"
                      value={snackColor}
                      onChange={(e) => handleSnackColorChange(e.target.value)}
                    />
                    <small> Share</small>
                  </div>
                </div>
                <div style={{ height: 300 }} className="d-flex align-items-center justify-content-center border rounded">
                  {loading ? (
                    <span className="text-muted">로딩 중...</span>
                  ) : popularSnackBrands.length > 0 ? (
                    <ReactApexChart
                      type="bar"
                      height={300}
                      series={[
                        { name: "Share", data: popularSnackBrands.map(d => d.share), color: snackColor }
                      ]}
                      options={{
                        chart: { toolbar: { show: false } },
                        colors: [snackColor],
                        xaxis: { categories: popularSnackBrands.map(d => d.name) },
                        plotOptions: { bar: { borderRadius: 4 } }
                      }}
                    />
                  ) : (
                    <span className="text-muted">데이터 없음</span>
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* 도넛 차트 모달 */}
        <Modal show={showModal === "donut"} onHide={closeModal} centered size="xl">
          <Modal.Header closeButton>
            <Modal.Title>도넛 차트</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* 가로 정렬 */}
            <div className="row g-4">
              {/* 왼쪽 차트 */}
              <div className="col-12 col-lg-6">
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
              </div>

              {/* 오른쪽 차트 */}
              <div className="col-12 col-lg-6">
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
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* 스택형 바 차트 모달 */}
        <Modal show={showModal === "stacked"} onHide={closeModal} centered size="xl">
          <Modal.Header closeButton>
            <Modal.Title>스택형 바 차트</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* 가로 정렬 */}
            <div className="row g-4">
              {/* 왼쪽 차트 */}
              <div className="col-12 col-lg-6">
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
              </div>

              {/* 오른쪽 차트 */}
              <div className="col-12 col-lg-6">
                {/* Weekly Workout Trend Stack Chart */}
                <h6 className="fw-bold mb-2">주간 운동량 스택형 바 차트</h6>
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
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* 면적 차트 모달 */}
        <Modal show={showModal === "area"} onHide={closeModal} centered size="xl">
          <Modal.Header closeButton>
            <Modal.Title>면적 차트</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* 가로 정렬 */}
            <div className="row g-4">
              {/* 왼쪽 차트 */}
              <div className="col-12 col-lg-6">
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
              </div>

              {/* 오른쪽 차트 */}
              <div className="col-12 col-lg-6">
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
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* 멀티라인 차트 모달 */}
        <Modal show={showModal === "multiline"} onHide={closeModal} centered size="xl">
          <Modal.Header closeButton>
            <Modal.Title>멀티라인 차트</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {/* 가로 정렬 */}
            <div className="row g-4">
              {/* 왼쪽 차트 */}
              <div className="col-12 col-lg-6">
                <h6 className="fw-bold mb-2">팀별 커피 소비/버그/생산성 차트</h6>
                <div
                  style={{ height: 500 }}
                  className="d-flex align-items-center justify-content-center border rounded mb-4"
                >
                  {loading ? (
                    <span className="text-muted">로딩 중...</span>
                  ) : coffeeConsumption.teams.length > 0 ? (
                    <ReactApexChart
                      type="line"
                      height={480}
                      series={(() => {
                        const colors = ["#008FFB", "#FF4560", "#00E396", "#775DD0"];

                        const seriesList: any[] = [];

                        coffeeConsumption.teams.forEach((teamObj: any, index: number) => {
                          const color = colors[index % colors.length];

                          seriesList.push(
                            {
                              name: `${teamObj.team} - Bugs`,
                              type: "line",
                              data: teamObj.series.map((d: any) => d.bugs),
                              color,
                              stroke: { width: 3, dashArray: 0 },
                              marker: { shape: "circle" },
                              yAxisIndex: 0
                            },
                            {
                              name: `${teamObj.team} - Productivity`,
                              type: "line",
                              data: teamObj.series.map((d: any) => d.productivity),
                              color,
                              stroke: { width: 3, dashArray: 6 },
                              marker: { shape: "square" },
                              yAxisIndex: 1
                            }
                          );
                        });

                        return seriesList;
                      })()}
                      options={{
                        chart: {
                          toolbar: { show: false },
                          zoom: { enabled: false }
                        },
                        legend: {
                          position: "top"
                        },
                        xaxis: {
                          categories:
                            coffeeConsumption.teams[0]?.series.map((d: any) => d.cups) || [],
                          title: { text: "커피 섭취량 (잔/일)" }
                        },
                        yaxis: [
                          {
                            title: { text: "버그 수 / 회의 불참" }
                          },
                          {
                            opposite: true,
                            title: { text: "생산성 / 사기" }
                          }
                        ],
                        stroke: { curve: "smooth" },
                        markers: { size: 5 },
                        tooltip: {
                          shared: false,
                          intersect: true,
                          custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
                            const seriesName = w.config.series[seriesIndex].name;
                            const teamName = seriesName.split(" - ")[0];
                            const metric = seriesName.split(" - ")[1];

                            const team = coffeeConsumption.teams.find(
                              (t: any) => t.team === teamName
                            );

                            if (!team) return "";

                            const point = team.series[dataPointIndex];

                            return `
                  <div style="padding:8px; font-size:12px;">
                    <b>${teamName}</b><br/>
                    커피: ${point.cups} 잔<br/>
                    버그 수: ${point.bugs}<br/>
                    생산성: ${point.productivity}
                  </div>
                `;
                          }
                        }
                      }}
                    />
                  ) : (
                    <span className="text-muted">데이터 없음</span>
                  )}
                </div>
              </div>

              {/* 오른쪽 차트 */}
              <div className="col-12 col-lg-6">
                {/* 간식 영향 멀티라인 차트 모달*/}
                <h6 className="fw-bold mb-2">부서별 간식 영향 차트</h6>
                <div
                  style={{ height: 500 }}
                  className="d-flex align-items-center justify-content-center border rounded mb-4"
                >
                  {loading ? (
                    <span className="text-muted">로딩 중...</span>
                  ) : snackImpact.departments?.length > 0 ? (
                    <ReactApexChart
                      type="line"
                      height={480}
                      series={(() => {
                        const colors = ["#008FFB", "#FF4560", "#00E396", "#775DD0"];
                        const seriesList: any[] = [];

                        snackImpact.departments.forEach((dept: any, index: number) => {
                          const color = colors[index % colors.length];

                          seriesList.push(
                            {
                              name: `${dept.name} - Meetings Missed`,
                              type: "line",
                              data: dept.metrics.map((m: any) => m.meetingsMissed),
                              color,
                              stroke: { width: 3, dashArray: 0 },
                              marker: { shape: "circle" },
                              yAxisIndex: 0
                            },
                            {
                              name: `${dept.name} - Morale`,
                              type: "line",
                              data: dept.metrics.map((m: any) => m.morale),
                              color,
                              stroke: { width: 3, dashArray: 6 },
                              marker: { shape: "square" },
                              yAxisIndex: 1
                            }
                          );
                        });

                        return seriesList;
                      })()}
                      options={{
                        chart: {
                          toolbar: { show: false },
                          zoom: { enabled: false }
                        },
                        legend: { position: "top" },
                        xaxis: {
                          categories:
                            snackImpact.departments[0]?.metrics.map((m: any) => m.snacks) || [],
                          title: { text: "스낵 섭취량 (개/일)" }
                        },
                        yaxis: [
                          {
                            title: { text: "회의 불참" }
                          },
                          {
                            opposite: true,
                            title: { text: "사기 (Morale)" }
                          }
                        ],
                        stroke: { curve: "smooth" },
                        markers: { size: 5 }
                      }}
                    />
                  ) : (
                    <span className="text-muted">데이터 없음</span>
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

      </div>
    </main>
  );
}
