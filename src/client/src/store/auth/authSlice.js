import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    errorMessage: null,
    isCheckingCredentials: false,
    status: 'not-authenticated',
    token: null,
    user: null,
  },
  reducers: {
    startCheckingCredentials: (state) => {
      state.isCheckingCredentials = true;
    },
    stopCheckingCredentials: (state) => {
      state.isCheckingCredentials = false;
    },
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

export const {login,logout,startCheckingCredentials,stopCheckingCredentials} = authSlice.actions;