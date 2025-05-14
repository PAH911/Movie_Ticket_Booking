import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/services/api";

export const fetchTicketInfo = createAsyncThunk(
  "buyTicket/fetchTicketInfo",
  async (maLichChieu, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`
      );
      return data.content;
    } catch (error) {
      return rejectWithValue(error.message || error);
    }
  }
);

const buyTicketSlice = createSlice({
  name: "buyTicketSlice",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketInfo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchTicketInfo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default buyTicketSlice.reducer;
