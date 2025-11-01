import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: { userId: "" },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setUserId } = usersSlice.actions;

export default usersSlice.reducer;
