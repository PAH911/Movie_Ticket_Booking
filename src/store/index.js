import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./slices/movieSlice";
import detailMovieReducer from "../pages/client-customer/MovieDetailPage/slice";
import buyTicketReducer from "../pages/client-customer/BuyTicket/slice";
import bannerReducer from "../pages/client-customer/Carousel/slice";
import authReducer from "./slices/authSlice";
import movieManagerReducer from "./slices/movieManager";
import userManagerReducer from "./slices/userManager";

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    detailMovie: detailMovieReducer,
    buyTicket: buyTicketReducer,
    banner: bannerReducer,
    auth: authReducer,
    movieManager: movieManagerReducer,
    userManager: userManagerReducer,
  },
});
