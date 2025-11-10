import { createSlice } from "@reduxjs/toolkit";

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState: {
    filter: "",
    selectedCampaign: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSelectedCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
    },
  },
});

export const { setFilter, setSelectedCampaign } = campaignsSlice.actions;

export default campaignsSlice.reducer;
