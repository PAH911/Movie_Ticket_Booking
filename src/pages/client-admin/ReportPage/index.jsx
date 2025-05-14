import React, { useEffect, useMemo, useState } from "react";
import { Card, Statistic, Row, Col } from "antd";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale,
  Filler,
} from "chart.js";
import { motion } from "framer-motion";
import {
  TrophyOutlined,
  DollarOutlined,
  FireOutlined,
} from "@ant-design/icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale,
  Filler
);

const cardColors = [
  "linear-gradient(135deg, #1677ff 0%, #86e7ff 100%)",
  "linear-gradient(135deg, #fd9125 0%, #ffe066 100%)",
  "linear-gradient(135deg, #a259ff 0%, #fbc2eb 100%)",
];

export default function ReportPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Lấy vé từ localStorage
    let storedTickets = JSON.parse(localStorage.getItem("myTickets") || "[]");
    setTickets(storedTickets);
  }, []);

  // Tính toán thống kê
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalTickets = 0;
    const revenueByDate = {};
    const ticketsByMovie = {};
    let hotMovie = "";
    let maxTickets = 0;

    tickets.forEach((ticket) => {
      totalRevenue += ticket.tongTien || 0;
      totalTickets += Array.isArray(ticket.ghe) ? ticket.ghe.length : 1;
      // Doanh thu theo ngày
      const date = ticket.ngayDat
        ? new Date(ticket.ngayDat).toISOString().slice(0, 10)
        : "unknown";
      revenueByDate[date] = (revenueByDate[date] || 0) + (ticket.tongTien || 0);
      // Vé theo phim
      if (ticket.tenPhim) {
        ticketsByMovie[ticket.tenPhim] =
          (ticketsByMovie[ticket.tenPhim] || 0) +
          (Array.isArray(ticket.ghe) ? ticket.ghe.length : 1);
        if (ticketsByMovie[ticket.tenPhim] > maxTickets) {
          maxTickets = ticketsByMovie[ticket.tenPhim];
          hotMovie = ticket.tenPhim;
        }
      }
    });
    return {
      totalRevenue,
      totalTickets,
      hotMovie,
      revenueByDate,
      ticketsByMovie,
    };
  }, [tickets]);

  const hasRevenueData = Object.keys(stats.revenueByDate).length > 0;
  const hasTicketsData = Object.keys(stats.ticketsByMovie).length > 0;

  // Chart gradient helpers
  const getLineGradient = (ctx, area) => {
    if (!area) return "#1677ff"; // fallback màu khi chưa có area
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    gradient.addColorStop(0, "rgba(22,119,255,0.1)");
    gradient.addColorStop(1, "rgba(253,145,37,0.3)");
    return gradient;
  };
  const getBarGradient = (ctx, area) => {
    if (!area) return "#a259ff"; // fallback màu khi chưa có area
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    gradient.addColorStop(0, "#a259ff");
    gradient.addColorStop(1, "#ffe066");
    return gradient;
  };

  // Dữ liệu cho biểu đồ doanh thu theo ngày
  const revenueChartData = useMemo(
    () => ({
      labels: Object.keys(stats.revenueByDate).sort(),
      datasets: [
        {
          label: "Doanh thu (VNĐ)",
          data: Object.keys(stats.revenueByDate)
            .sort()
            .map((date) => stats.revenueByDate[date]),
          borderColor: "#1677ff",
          backgroundColor: hasRevenueData
            ? (ctx) => getLineGradient(ctx.chart.ctx, ctx.chart.chartArea)
            : "#1677ff",
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: "#fd9125",
        },
      ],
    }),
    [stats.revenueByDate, hasRevenueData]
  );

  // Dữ liệu cho biểu đồ số vé theo phim
  const ticketsChartData = useMemo(
    () => ({
      labels: Object.keys(stats.ticketsByMovie),
      datasets: [
        {
          label: "Số vé bán",
          data: Object.keys(stats.ticketsByMovie).map(
            (name) => stats.ticketsByMovie[name]
          ),
          backgroundColor: (ctx) =>
            getBarGradient(ctx.chart.ctx, ctx.chart.chartArea),
          borderRadius: 12,
          hoverBackgroundColor: "#fd9125",
        },
      ],
    }),
    [stats.ticketsByMovie]
  );

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { color: "#222", font: { size: 14 } } },
      title: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#1677ff",
        bodyColor: "#fd9125",
        borderColor: "#1677ff",
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
      },
    },
    animation: {
      duration: 1200,
      easing: "easeInOutQuart",
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày",
          color: "#1677ff",
          font: { size: 16 },
        },
        ticks: { color: "#555" },
        grid: { color: "#f0f0f0" },
      },
      y: {
        title: {
          display: true,
          text: "Doanh thu (VNĐ)",
          color: "#fd9125",
          font: { size: 16 },
        },
        ticks: { color: "#555" },
        grid: { color: "#f0f0f0" },
      },
    },
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#a259ff",
        bodyColor: "#fd9125",
        borderColor: "#a259ff",
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
      },
    },
    animation: {
      duration: 1200,
      easing: "easeInOutQuart",
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tên phim",
          color: "#a259ff",
          font: { size: 16 },
        },
        ticks: { color: "#555" },
        grid: { color: "#f0f0f0" },
      },
      y: {
        title: {
          display: true,
          text: "Số vé",
          color: "#fd9125",
          font: { size: 16 },
        },
        ticks: { color: "#555" },
        grid: { color: "#f0f0f0" },
      },
    },
  };

  return (
    <motion.div
      className="bg-white p-8 rounded-2xl shadow-xl min-h-screen"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1677ff] via-[#fd9125] to-[#a259ff] mb-2">
          Báo cáo & Thống kê doanh thu
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Theo dõi hiệu quả kinh doanh, doanh thu và các phim bán chạy nhất trên
          hệ thống. Dữ liệu được tổng hợp tự động từ các vé đã đặt.
        </p>
      </div>
      <Row gutter={24} className="mb-8">
        <Col span={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              style={{
                background: cardColors[0],
                border: "none",
                borderRadius: 18,
                boxShadow: "0 4px 24px 0 rgba(22,119,255,0.08)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Statistic
                title={
                  <span className="text-white font-semibold">
                    Tổng doanh thu
                  </span>
                }
                value={stats.totalRevenue.toLocaleString()}
                suffix={<span className="text-white">VNĐ</span>}
                prefix={
                  <DollarOutlined
                    style={{ color: "#fff", fontSize: 28, marginRight: 8 }}
                  />
                }
                valueStyle={{ color: "#fff", fontWeight: 700, fontSize: 28 }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col span={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              style={{
                background: cardColors[1],
                border: "none",
                borderRadius: 18,
                boxShadow: "0 4px 24px 0 rgba(253,145,37,0.08)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Statistic
                title={
                  <span className="text-white font-semibold">Tổng vé bán</span>
                }
                value={stats.totalTickets}
                prefix={
                  <TrophyOutlined
                    style={{ color: "#fff", fontSize: 28, marginRight: 8 }}
                  />
                }
                valueStyle={{ color: "#fff", fontWeight: 700, fontSize: 28 }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col span={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              style={{
                background: cardColors[2],
                border: "none",
                borderRadius: 18,
                boxShadow: "0 4px 24px 0 rgba(162,89,255,0.08)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Statistic
                title={
                  <span className="text-white font-semibold">
                    Phim hot nhất
                  </span>
                }
                value={stats.hotMovie || "-"}
                prefix={
                  <FireOutlined
                    style={{ color: "#fff", fontSize: 28, marginRight: 8 }}
                  />
                }
                valueStyle={{ color: "#fff", fontWeight: 700, fontSize: 24 }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-10"
      >
        <h3 className="font-semibold mb-4 text-lg text-[#1677ff]">
          Biểu đồ doanh thu theo ngày
        </h3>
        <div className="bg-gradient-to-br from-[#e3f0ff] to-[#fffbe6] p-6 rounded-2xl shadow-lg">
          <Line data={revenueChartData} options={lineOptions} height={90} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-semibold mb-4 text-lg text-[#a259ff]">
          Biểu đồ số vé bán theo phim
        </h3>
        <div className="bg-gradient-to-br from-[#fbc2eb] to-[#ffe066] p-6 rounded-2xl shadow-lg">
          <Bar data={ticketsChartData} options={barOptions} height={90} />
        </div>
      </motion.div>
    </motion.div>
  );
}
