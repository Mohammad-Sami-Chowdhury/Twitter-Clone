import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userLoginInfo")
    ? JSON.parse(localStorage.getItem("userLoginInfo"))
    : null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoginInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    updateDisplayName(state, action) {
      state.userInfo.displayName = action.payload;
    },
  },
});

export const { userLoginInfo, updateDisplayName } = userSlice.actions;

export default userSlice.reducer;
