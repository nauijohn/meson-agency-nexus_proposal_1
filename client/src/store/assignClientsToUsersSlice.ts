import { createSlice } from "@reduxjs/toolkit";

const assignClientsToUsersSlice = createSlice({
  name: "clientsToUsers",
  initialState: { userId: "", unassignedClients: [], assignedClients: [] },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUnassignedClients: (state, action) => {
      state.unassignedClients = action.payload;
    },
    setAssignedClients: (state, action) => {
      state.assignedClients = action.payload;
    },
  },
});

export const { setUserId, setUnassignedClients, setAssignedClients } =
  assignClientsToUsersSlice.actions;
export default assignClientsToUsersSlice.reducer;
