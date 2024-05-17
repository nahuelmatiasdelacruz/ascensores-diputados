import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    errorMessage: null,
    isCheckingCredentials: true,
    status: 'not-authenticated',
    token: null,
    user: null,
  },
  reducers: {
    login: (state,{payload})=>{
      state.errorMessage = null;
      state.isCheckingCredentials = false;
      state.status = 'authenticated';
      state.token = payload.token;
      state.user = payload.user;
    },
    logout: (state,{payload}) =>{
      state.errorMessage = payload?.errorMessage;
      state.isCheckingCredentials = false;
      state.status = 'not-authenticated';
      state.token = null;
      state.user = null;
    }
  }
});

export const {login,logout} = authSlice.actions;