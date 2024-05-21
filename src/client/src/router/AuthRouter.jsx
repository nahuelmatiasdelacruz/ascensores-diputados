import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../components';

export const AuthRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='*' element={<Navigate to='/'/>}/>
    </Routes>
  );
};
