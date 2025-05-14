import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
} from "antd";
import {
  getUserList,
  getUserTypes,
  addUser,
  updateUser,
  deleteUser,
} from "../../../api/services/userService";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function UserManagerPage() {
  const [users, setUsers] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async (keyword = "") => {
    setLoading(true);
    const res = await getUserList(keyword);
    setUsers(res.content || res.data?.content || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    getUserTypes().then((res) => setUserTypes(res.content || []));
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchUsers(e.target.value);
  };

  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
      matKhau: "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (taiKhoan) => {
    await deleteUser(taiKhoan);
    message.success("Xóa người dùng thành công!");
    fetchUsers(search);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const data = {
        taiKhoan: values.taiKhoan?.trim(),
        matKhau: values.matKhau,
        hoTen: values.hoTen?.trim(),
        email: values.email?.trim(),
        soDt: values.soDt?.trim(),
        maNhom: "GP01",
        maLoaiNguoiDung: values.maLoaiNguoiDung,
      };
      if (
        !data.taiKhoan ||
        !data.matKhau ||
        !data.hoTen ||
        !data.email ||
        !data.soDt ||
        !data.maLoaiNguoiDung
      ) {
        message.error("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      if (editingUser) {
        await updateUser(data);
        message.success("Cập nhật thành công!");
      } else {
        await addUser(data);
        message.success("Thêm người dùng thành công!");
      }
      setModalOpen(false);
      fetchUsers(search);
    });
  };

  const columns = [
    { title: "Tài khoản", dataIndex: "taiKhoan" },
    { title: "Họ tên", dataIndex: "hoTen" },
    { title: "Email", dataIndex: "email" },
    { title: "Số ĐT", dataIndex: "soDt" },
    { title: "Loại", dataIndex: "maLoaiNguoiDung" },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            className="text-blue-500 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.taiKhoan)}
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              danger
              className="text-red-500 hover:text-red-700"
            >
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#1677ff] via-[#fd9125] to-[#a259ff] text-transparent bg-clip-text drop-shadow-lg">
          Quản lý người dùng
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined style={{ fontSize: 20 }} />}
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#fd9125] to-[#ffe066] text-white font-bold px-6 py-2 rounded-xl shadow hover:from-[#ffe066] hover:to-[#fd9125] hover:text-[#1677ff] transition-all duration-200"
        >
          Thêm người dùng
        </Button>
      </div>
      <Table
        rowKey="taiKhoan"
        columns={columns}
        dataSource={users}
        loading={loading}
        className="rounded-xl shadow-lg overflow-hidden"
        pagination={{ pageSize: 10 }}
        bordered
      />
      <Modal
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        className="rounded-2xl"
        okButtonProps={{ className: "bg-[#1677ff] font-bold" }}
        cancelButtonProps={{ className: "font-bold" }}
      >
        <Form form={form} layout="vertical" className="space-y-2">
          <Form.Item
            name="taiKhoan"
            label="Tài khoản"
            rules={[{ required: true }]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới hoặc cũ!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="soDt"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="maLoaiNguoiDung"
            label="Loại người dùng"
            rules={[{ required: true }]}
          >
            <Select>
              {userTypes.map((type) => (
                <Select.Option
                  key={type.maLoaiNguoiDung}
                  value={type.maLoaiNguoiDung}
                >
                  {type.tenLoai}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
