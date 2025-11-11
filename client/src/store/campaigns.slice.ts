import { createSlice } from "@reduxjs/toolkit";

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState: { id: "" },
  reducers: {
    setCampaignId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setCampaignId } = campaignsSlice.actions;

export default campaignsSlice.reducer;
