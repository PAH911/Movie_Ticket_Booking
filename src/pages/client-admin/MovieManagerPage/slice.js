import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { movieService } from "../../../api/services/movieService";

export const getMovies = createAsyncThunk(
  "movieManager/getMovies",
  async () => {
    const res = await movieService.getMovieList();
    return res.data.content;
  }
);

export const addMovie = createAsyncThunk(
  "movieManager/addMovie",
  async (movie, { rejectWithValue }) => {
    try {
      // Validate file size
      if (movie.hinhAnh?.file?.originFileObj) {
        const fileSize = movie.hinhAnh.file.originFileObj.size / 1024 / 1024; // Convert to MB
        if (fileSize > 5) {
          return rejectWithValue("Kích thước file không được vượt quá 5MB");
        }
      }

      const formData = new FormData();
      Object.entries(movie).forEach(([key, value]) => {
        if (key === "hinhAnh" && value) {
          formData.append("File", value);
        } else {
          formData.append(key, value);
        }
      });

      for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      await movieService.addMovie(formData);
      const res = await movieService.getMovieList();
      return res.data.content;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.content || "Thêm phim thất bại"
      );
    }
  }
);

export const updateMovie = createAsyncThunk(
  "movieManager/updateMovie",
  async (movie, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(movie).forEach(([key, value]) => {
        if (key === "hinhAnh" && value && value.file) {
          formData.append("hinhAnh", value.file.originFileObj);
        } else {
          formData.append(key, value);
        }
      });
      await movieService.updateMovie(formData);
      const res = await movieService.getMovieList();
      return res.data.content;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.content || "Cập nhật phim thất bại"
      );
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "movieManager/deleteMovie",
  async (maPhim, { rejectWithValue }) => {
    try {
      await movieService.deleteMovie(maPhim);
      const res = await movieService.getMovieList();
      return res.data.content;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.content || "Xóa phim thất bại"
      );
    }
  }
);

const movieManagerSlice = createSlice({
  name: "movieManager",
  initialState: { movies: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
        state.loading = false;
      })
      .addCase(getMovies.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.movies = action.payload;
        state.loading = false;
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.movies = action.payload;
        state.loading = false;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = action.payload;
        state.loading = false;
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default movieManagerSlice.reducer;
