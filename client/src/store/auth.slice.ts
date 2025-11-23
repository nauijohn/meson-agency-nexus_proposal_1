import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    isAuthenticated: false,
    isRestoring: true,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    finishRestoring: (state) => {
      state.isRestoring = false;
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, finishRestoring, logout } = authSlice.actions;
export default authSlice.reducer;
