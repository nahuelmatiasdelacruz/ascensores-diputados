import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AscensoresRouter } from './AscensoresRouter';
import { AuthRouter } from './AuthRouter';

export const AppRouter = () => {
  const { status } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <Routes>
        {status === 'authenticated' ? <Route path="/*" element={<AscensoresRouter />}/> : <Route path="/*" element={<AuthRouter />}/>}
      </Routes>
    </BrowserRouter>
  );
};
