import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/services/api";

export const fetchDetailMovie = createAsyncThunk(
  "detailMovie/fetchDetailMovie",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/QuanLyPhim/LayThongTinPhim?MaPhim=${id}`
      );
      return data.content;
    } catch (error) {
      return rejectWithValue(error.message || error);
    }
  }
);

export const fetchShowtimes = createAsyncThunk(
  "detailMovie/fetchShowtimes",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${id}`
      );
      return data.content;
    } catch (error) {
      return rejectWithValue(error.message || error);
    }
  }
);

const detailMovieSlice = createSlice({
  name: "detailMovieSlice",
  initialState: {
    loading: false,
    data: null,
    error: null,
    showtimes: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailMovie.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchDetailMovie.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchShowtimes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowtimes.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.showtimes = payload;
      })
      .addCase(fetchShowtimes.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default detailMovieSlice.reducer;
