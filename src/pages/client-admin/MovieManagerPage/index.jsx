import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  DatePicker,
  Checkbox,
  InputNumber,
  Select,
} from "antd";
import { getMovies, addMovie, updateMovie, deleteMovie } from "./slice";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getTheaterSystems,
  getTheaterClusters,
  createShowtime,
} from "../../../api/services/cinemaApi";

export default function MovieManagerPage() {
  const dispatch = useDispatch();
  const { movies, loading, error } = useSelector((state) => state.movieManager);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingMovie, setEditingMovie] = React.useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState([]);
  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const [showtimeForm] = Form.useForm();
  const [cinemaSystems, setCinemaSystems] = React.useState([]);
  const [cinemas, setCinemas] = React.useState([]);
  const [showtimeLoading, setShowtimeLoading] = React.useState(false);

  useEffect(() => {
    dispatch(getMovies());
  }, [dispatch]);

  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  useEffect(() => {
    getTheaterSystems().then((res) =>
      setCinemaSystems(res.data?.content || [])
    );
  }, []);

  const handleAdd = () => {
    setEditingMovie(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };
  const handleEdit = (record) => {
    setEditingMovie(record);

    // Nếu ngày là string ISO (2024-05-16T00:00:00), dayjs tự hiểu
    // Nếu là dạng khác, cần truyền format đúng
    let ngayKhoiChieu = null;
    if (record.ngayKhoiChieu) {
      // Nếu là số hoặc object, chuyển sang string
      const dateStr = String(record.ngayKhoiChieu);
      // Nếu có ký tự '-', thường là ISO hoặc yyyy-MM-dd
      if (dateStr.includes("-")) {
        ngayKhoiChieu = dayjs(dateStr);
      } else if (dateStr.includes("/")) {
        ngayKhoiChieu = dayjs(dateStr, "DD/MM/YYYY");
      } else {
        ngayKhoiChieu = dayjs(dateStr);
      }
    }

    form.setFieldsValue({
      ...record,
      ngayKhoiChieu,
    });

    setFileList(
      record.hinhAnh ? [{ url: record.hinhAnh, name: "Ảnh phim" }] : []
    );
    setIsModalOpen(true);
  };
  const handleDelete = (id) => {
    dispatch(deleteMovie(id)).then((res) => {
      if (!res.error) message.success("Xóa phim thành công!");
    });
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (!editingMovie && fileList.length === 0) {
        message.error("Vui lòng chọn hình ảnh!");
        return;
      }
      values.ngayKhoiChieu = values.ngayKhoiChieu
        ? dayjs(values.ngayKhoiChieu).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");
      values.dangChieu = String(!!values.dangChieu);
      values.sapChieu = String(!!values.sapChieu);
      values.hot = String(!!values.hot);
      values.danhGia = Number(values.danhGia) || 0;
      values.maNhom = values.maNhom || "GP01";
      if (fileList.length > 0 && fileList[0].originFileObj) {
        values.hinhAnh = fileList[0].originFileObj;
      } else {
        values.hinhAnh = null;
      }
      if (editingMovie) {
        values.maPhim = editingMovie.maPhim;
        dispatch(updateMovie(values)).then((res) => {
          if (!res.error) message.success("Cập nhật phim thành công!");
          dispatch(getMovies());
        });
      } else {
        dispatch(addMovie(values)).then((res) => {
          if (!res.error) {
            message.success("Thêm phim thành công!");
            dispatch(getMovies());
          }
        });
      }
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
    });
  };
  const handleOpenShowtimeModal = (movie) => {
    setSelectedMovie(movie);
    setIsShowtimeModalOpen(true);
    showtimeForm.resetFields();
    setCinemas([]);
    getTheaterSystems().then((res) => {
      if (Array.isArray(res)) setCinemaSystems(res);
      else if (res.content) setCinemaSystems(res.content);
      else if (res.data && res.data.content) setCinemaSystems(res.data.content);
      else setCinemaSystems([]);
    });
  };
  const handleCinemaSystemChange = (maHeThongRap) => {
    console.log("Chọn hệ thống rạp:", maHeThongRap);
    form.setFieldsValue({ maRap: undefined });
    getTheaterClusters(maHeThongRap).then((res) => {
      console.log("Cụm rạp:", res);
      if (Array.isArray(res)) setCinemas(res);
      else if (res.content) setCinemas(res.content);
      else if (res.data && res.data.content) setCinemas(res.data.content);
      else setCinemas([]);
    });
  };
  const handleCreateShowtime = (values) => {
    setShowtimeLoading(true);
    const payload = {
      maPhim: selectedMovie.maPhim,
      maRap: values.maRap,
      ngayChieuGioChieu: dayjs(values.ngayChieuGioChieu).format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
      giaVe: values.giaVe,
    };
    createShowtime(payload)
      .then(() => {
        message.success("Tạo lịch chiếu thành công!");
        setIsShowtimeModalOpen(false);
      })
      .catch(() => message.error("Tạo lịch chiếu thất bại!"))
      .finally(() => setShowtimeLoading(false));
  };
  const columns = [
    { title: "Mã phim", dataIndex: "maPhim" },
    { title: "Tên phim", dataIndex: "tenPhim" },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      render: (src) => (
        <img src={src} alt="hinhAnh" className="w-16 h-20 object-cover" />
      ),
    },
    { title: "Mô tả", dataIndex: "moTa", ellipsis: true },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-500 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.maPhim)}
            className="text-red-500 hover:text-red-700"
          >
            Xóa
          </Button>
          <Button
            type="link"
            icon={<CalendarOutlined />}
            onClick={() => handleOpenShowtimeModal(record)}
            className="text-green-500 hover:text-green-700"
          >
            Tạo suất chiếu
          </Button>
        </>
      ),
    },
  ];
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#1677ff] via-[#fd9125] to-[#a259ff] text-transparent bg-clip-text drop-shadow-lg">
          Quản lý phim
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined style={{ fontSize: 20 }} />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-[#fd9125] to-[#ffe066] text-white font-bold px-6 py-2 rounded-xl shadow hover:from-[#ffe066] hover:to-[#fd9125] hover:text-[#1677ff] transition-all duration-200"
        >
          Thêm phim
        </Button>
      </div>
      <Table
        rowKey="maPhim"
        columns={columns.map((col) =>
          col.title === "Hành động" ? { ...col, width: 220 } : col
        )}
        dataSource={movies}
        loading={loading}
        className="rounded-xl shadow-lg overflow-hidden"
        pagination={{ pageSize: 8 }}
        bordered
      />
      <Modal
        title={editingMovie ? "Sửa phim" : "Thêm phim"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        className="rounded-2xl"
        okButtonProps={{ className: "bg-[#1677ff] font-bold" }}
        cancelButtonProps={{ className: "font-bold" }}
      >
        <Form form={form} layout="vertical" className="space-y-2">
          <Form.Item
            name="tenPhim"
            label="Tên phim"
            rules={[{ required: true, message: "Nhập tên phim" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="trailer" label="Trailer">
            <Input />
          </Form.Item>
          <Form.Item
            name="moTa"
            label="Mô tả"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="ngayKhoiChieu" label="Ngày khởi chiếu">
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>
          <div className="flex gap-4 mb-2">
            <Form.Item name="dangChieu" valuePropName="checked">
              <Checkbox>Đang chiếu</Checkbox>
            </Form.Item>
            <Form.Item name="sapChieu" valuePropName="checked">
              <Checkbox>Sắp chiếu</Checkbox>
            </Form.Item>
            <Form.Item name="hot" valuePropName="checked">
              <Checkbox>Hot</Checkbox>
            </Form.Item>
          </div>
          <Form.Item name="danhGia" label="Số sao">
            <InputNumber min={0} max={10} className="w-full" />
          </Form.Item>
          <Form.Item name="maNhom" label="Mã nhóm" initialValue="GP01">
            <Select defaultValue="GP01">
              <Select.Option value="GP01">GP01</Select.Option>
              <Select.Option value="GP02">GP02</Select.Option>
              <Select.Option value="GP03">GP03</Select.Option>
              <Select.Option value="GP04">GP04</Select.Option>
              <Select.Option value="GP05">GP05</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="hinhAnh"
            label="Hình ảnh"
            rules={[{ required: true, message: "Vui lòng chọn hình ảnh" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={fileList}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                const isLt5M = file.size / 1024 / 1024 < 5;

                if (!isImage) {
                  message.error("Chỉ chấp nhận file ảnh!");
                  return Upload.LIST_IGNORE;
                }
                if (!isLt5M) {
                  message.error("Kích thước file không được vượt quá 5MB!");
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              {fileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          selectedMovie
            ? `Tạo suất chiếu cho phim: ${selectedMovie.tenPhim}`
            : "Tạo suất chiếu"
        }
        open={isShowtimeModalOpen}
        onCancel={() => setIsShowtimeModalOpen(false)}
        footer={null}
        className="rounded-2xl"
      >
        <Form
          form={showtimeForm}
          layout="vertical"
          onFinish={handleCreateShowtime}
          className="space-y-2"
        >
          <Form.Item
            name="maHeThongRap"
            label="Hệ thống rạp"
            rules={[{ required: true, message: "Chọn hệ thống rạp" }]}
          >
            <Select
              placeholder="Chọn hệ thống rạp"
              onChange={handleCinemaSystemChange}
            >
              {cinemaSystems.map((htr) => (
                <Select.Option key={htr.maHeThongRap} value={htr.maHeThongRap}>
                  {htr.tenHeThongRap}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="maRap"
            label="Rạp"
            rules={[{ required: true, message: "Chọn rạp" }]}
          >
            <Select placeholder="Chọn rạp">
              {cinemas.map((cumRap) =>
                cumRap.danhSachRap.map((rap) => (
                  <Select.Option key={rap.maRap} value={rap.maRap}>
                    {cumRap.tenCumRap + " - " + rap.tenRap}
                  </Select.Option>
                ))
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="ngayChieuGioChieu"
            label="Ngày chiếu giờ chiếu"
            rules={[{ required: true, message: "Chọn ngày giờ" }]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
              placeholder="dd/mm/yyyy --:--"
            />
          </Form.Item>
          <Form.Item
            name="giaVe"
            label="Giá vé"
            rules={[{ required: true, message: "Nhập giá vé" }]}
          >
            <InputNumber min={0} max={200000} style={{ width: "100%" }} />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={showtimeLoading}
            block
            className="bg-gradient-to-r from-[#1677ff] to-[#fd9125] text-white font-bold rounded-xl mt-4"
          >
            Tạo lịch chiếu
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
