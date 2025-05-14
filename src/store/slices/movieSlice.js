import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { movieService } from "../../api/services/movieService";

// Async thunks
export const fetchMovieList = createAsyncThunk(
  "movies/fetchMovieList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await movieService.getMovieList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải danh sách phim"
      );
    }
  }
);

export const searchMovies = createAsyncThunk(
  "movies/searchMovies",
  async (searchParams, { rejectWithValue }) => {
    try {
      const { keyword, genre, actor } = searchParams;
      const response = await movieService.searchMovies({
        tenPhim: keyword,
        theLoai: genre,
        dienVien: actor,
      });
      return response.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.content || "Lỗi khi tìm kiếm phim"
      );
    }
  }
);

export const fetchMovieDetail = createAsyncThunk(
  "movies/fetchMovieDetail",
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await movieService.getMovieDetail(movieId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải thông tin phim"
      );
    }
  }
);

export const fetchMovieShowtimes = createAsyncThunk(
  "movies/fetchMovieShowtimes",
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await movieService.getMovieShowtimes(movieId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi tải lịch chiếu");
    }
  }
);

const initialState = {
  movieList: [],
  movieDetail: null,
  showtimes: null,
  loading: false,
  error: null,
  filters: {
    keyword: "",
    genre: "",
    actor: "",
  },
  searchResults: [],
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Movie List
      .addCase(fetchMovieList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieList.fulfilled, (state, action) => {
        state.loading = false;
        state.movieList = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.content || [];
      })
      .addCase(fetchMovieList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Movies
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Movie Detail
      .addCase(fetchMovieDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.movieDetail = action.payload;
      })
      .addCase(fetchMovieDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Movie Showtimes
      .addCase(fetchMovieShowtimes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieShowtimes.fulfilled, (state, action) => {
        state.loading = false;
        state.showtimes = action.payload;
      })
      .addCase(fetchMovieShowtimes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters } = movieSlice.actions;
export default movieSlice.reducer;
