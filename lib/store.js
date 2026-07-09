import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "@/stores/exampleSlice";

export const store = configureStore({
  reducer: {
    example: exampleReducer,
  },
});
