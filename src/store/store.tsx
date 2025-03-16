import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "@/store/slices/exampleSlices";
import { saveState } from "@/utils/localStorage";

const store = configureStore({
  reducer: {
    example: exampleReducer, // Add reducers here
  },
});

store.subscribe(() => {
  saveState("exampleState", store.getState().example);
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
