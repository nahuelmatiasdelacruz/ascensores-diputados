
import axios from 'axios';
import {login,logout, startCheckingCredentials, stopCheckingCredentials} from './authSlice';
import { server } from '../../helpers/constants';

export const startLogin = ({user,password}) => {
  return async (dispatch) => {
    try{
      dispatch(startCheckingCredentials());
      const {data} = await axios.post(`${server}/api/auth`, { user, password });
      sessionStorage.setItem('x-token', data.token);
      sessionStorage.setItem('userName', data.userData.userName);
      dispatch(login({ user: data.userData.userName,token: data.token }));
    }catch(e){
      dispatch(logout({errorMessage: e.message}));
    }finally{
      dispatch(stopCheckingCredentials());
    }
  }
};

export const startLogout = () => {
  return async (dispatch) => {
    sessionStorage.clear();
    dispatch(logout());
  }
}