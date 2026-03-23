import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "./store";

type User = {
  email: string;
  id: string;
  name: string;
  role: "USER" | "MODERATOR" | "SUPER_ADMIN";
  hasTakenSurvey: boolean;
};

type TAuthState = {
  user: null | User;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      // Remove token from cookies
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const useCurrentUser = (state: RootState) => state.auth.user;
