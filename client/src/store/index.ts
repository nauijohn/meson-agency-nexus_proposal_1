import api from "@/services/api";
import { configureStore } from "@reduxjs/toolkit";

import campaignsSlice from "./campaigns.slice";
import clientsSlice from "./clients.slice";
import usersReducer from "./users.slice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    users: usersReducer,
    clients: clientsSlice,
    campaigns: campaignsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // needed for caching & refetching
});

// export const assetsActions = assetsSlice.actions;
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
