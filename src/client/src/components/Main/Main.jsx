import React, { useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Outlet} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu/SideMenu';

export const Main = () => {
  const navigate = useNavigate();
  const checkLogin = () => {
    const token = sessionStorage.getItem('x-token');
    const userName = sessionStorage.getItem('userName');
    if(!token && !userName){
      navigate('/login');
    }
  }
  useEffect(() => {
    checkLogin();
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='main-app'>
        <SideMenu />
        <div className='main-content'>
          <Outlet/>
        </div>
      </div>
    </LocalizationProvider>
  );
};
