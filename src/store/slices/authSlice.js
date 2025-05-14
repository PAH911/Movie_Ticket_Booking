import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/services/api";
import { toast } from "react-toastify";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/QuanLyNguoiDung/DangNhap", credentials);
      const { accessToken, ...userData } = response.data.content;

      // Store token in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.content || "Đăng nhập thất bại"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/QuanLyNguoiDung/DangKy", userData);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.content || "Đăng ký thất bại"
      );
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
  verificationStatus: {
    email: false,
    phone: false,
  },
  showLoginModal: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.verificationStatus = {
        email: false,
        phone: false,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    openLoginModal: (state) => {
      state.showLoginModal = true;
    },
    closeLoginModal: (state) => {
      state.showLoginModal = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        toast.success("Đăng nhập thành công!");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        toast.success(
          "Đăng ký thành công! Vui lòng xác thực email/số điện thoại."
        );
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout, clearError, openLoginModal, closeLoginModal } =
  authSlice.actions;
export default authSlice.reducer;
