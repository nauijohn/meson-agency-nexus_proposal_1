import api from "@/services/api";
import { configureStore } from "@reduxjs/toolkit";

import usersReducer from "./usersSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // needed for caching & refetching
});

// export const assetsActions = assetsSlice.actions;
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
