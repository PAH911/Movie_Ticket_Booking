import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function ShowtimeManagerPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Lấy vé từ localStorage giống trang /myticket
    let storedTickets = JSON.parse(localStorage.getItem("myTickets") || "[]");
    // Sắp xếp vé mới nhất lên đầu
    storedTickets.sort((a, b) => {
      const dateA = a.ngayDat ? new Date(a.ngayDat) : new Date(a.thoiGian);
      const dateB = b.ngayDat ? new Date(b.ngayDat) : new Date(b.thoiGian);
      return dateB - dateA;
    });
    setTickets(storedTickets);
    setLoading(false);
  }, []);

  const handleCancelTicket = (ticket) => {
    // Xóa vé khỏi localStorage
    const updatedTickets = tickets.filter(
      (t) =>
        t.maLichChieu !== ticket.maLichChieu || t.ngayDat !== ticket.ngayDat
    );
    localStorage.setItem("myTickets", JSON.stringify(updatedTickets));
    setTickets(updatedTickets);
    message.success("Hủy vé thành công!");
  };

  const columns = [
    { title: "Tên phim", dataIndex: "tenPhim" },
    { title: "Rạp", dataIndex: "tenRap" },
    {
      title: "Ghế",
      dataIndex: "ghe",
      render: (ghe) =>
        Array.isArray(ghe) ? ghe.map((g) => g.tenGhe).join(", ") : "-",
    },
    {
      title: "Tổng tiền",
      dataIndex: "tongTien",
      render: (tongTien) => tongTien?.toLocaleString() + "đ",
    },
    {
      title: "Ngày đặt",
      dataIndex: "ngayDat",
      render: (ngayDat) =>
        ngayDat
          ? new Date(ngayDat).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "-",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleCancelTicket(record)}
          className="bg-gradient-to-r from-red-500 to-red-400 text-red-500 font-bold rounded-lg px-4 py-2 shadow hover:from-red-400 hover:to-red-500 hover:scale-105 transition-all duration-200"
        >
          Hủy vé
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl min-h-screen">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#1677ff] via-[#fd9125] to-[#a259ff] text-transparent bg-clip-text drop-shadow-lg mb-8">
        Quản lý vé người dùng
      </h2>
      <Table
        rowKey={(record) => record.maLichChieu + record.ngayDat}
        columns={columns}
        dataSource={tickets}
        loading={loading}
        className="rounded-xl shadow-lg overflow-hidden"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
}
