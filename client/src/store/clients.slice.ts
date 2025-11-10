import { createSlice } from "@reduxjs/toolkit";

const clientsSlice = createSlice({
  name: "clients",
  initialState: { id: null },
  reducers: {
    setClientId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setClientId } = clientsSlice.actions;

export default clientsSlice.reducer;
