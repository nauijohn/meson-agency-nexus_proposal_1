import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    roles: [] as string[],
    employee: null,
  },
  reducers: {
    setUser: (state, action) => {
      console.log("Setting user in users.slice: ", action.payload);
      return action.payload;
    },
  },
});

export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;
