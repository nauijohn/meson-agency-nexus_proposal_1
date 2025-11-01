// clientsSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    filter: "",
    selectedClient: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
  },
});

export const { setFilter, setSelectedClient } = clientsSlice.actions;

export default clientsSlice.reducer;
