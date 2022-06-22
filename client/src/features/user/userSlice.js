import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import {
  getUserFromLocalStorage,
  addUserToLocalStorage,
} from "../../utils/localStorage.js";

import api from "../../utils/axios";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (user, thunkAPI) => {
    try {
      const resp = await api.post("/api/v1/auth/register", user);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (user, thunkAPI) => {
    try {
      const resp = await api.post("/api/v1/auth/login", user);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const initialState = {
  user: getUserFromLocalStorage(),
  isLoadingUser: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.isLoadingUser = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      const user = payload;
      state.isLoadingUser = false;
      state.user = user;
      addUserToLocalStorage(user);
      toast.success(`Hi There! ${user.username}`);
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.isLoadingUser = false;
      toast.error(payload);
    },

    [loginUser.pending]: (state) => {
      state.isLoadingUser = true;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      const user = payload;
      state.isLoadingUser = false;
      state.user = user;
      addUserToLocalStorage(user);
      toast.success(`Welcome back! ${user.username}`);
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isLoadingUser = false;
      toast.error(payload);
    },
  },
});

export default userSlice.reducer;
