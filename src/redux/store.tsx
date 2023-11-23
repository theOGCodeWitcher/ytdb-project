import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./userSlice";

const store = configureStore({
  reducer: userSliceReducer,
});

export default store;
