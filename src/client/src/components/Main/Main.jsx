import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Outlet} from 'react-router-dom';
import SideMenu from './SideMenu/SideMenu';

export const Main = () => {
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
