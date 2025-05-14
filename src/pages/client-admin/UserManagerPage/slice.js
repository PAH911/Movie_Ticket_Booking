import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../../api/services/authService";

export const getUsers = createAsyncThunk("userManager/getUsers", async () => {
  // TODO: Gọi API lấy danh sách người dùng
  return [];
});

export const addUser = createAsyncThunk("userManager/addUser", async (user) => {
  // TODO: Gọi API thêm người dùng
  return user;
});

export const updateUser = createAsyncThunk(
  "userManager/updateUser",
  async (user) => {
    // TODO: Gọi API cập nhật người dùng
    return user;
  }
);

export const deleteUser = createAsyncThunk(
  "userManager/deleteUser",
  async (taiKhoan) => {
    // TODO: Gọi API xóa người dùng
    return taiKhoan;
  }
);

const userManagerSlice = createSlice({
  name: "userManager",
  initialState: { users: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(getUsers.rejected, (state) => {
        state.loading = false;
      });
    // TODO: Thêm xử lý cho add, update, delete
  },
});

export default userManagerSlice.reducer;
