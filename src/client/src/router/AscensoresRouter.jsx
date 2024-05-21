import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Main, IndexPage } from '../components';
import { routesList } from './RoutesList';

export const AscensoresRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Main />}>
        <Route index element={<IndexPage />} />
        {routesList.map(({ path, RouteComponent }) => (<Route key={path} exact path={path} element={<RouteComponent />}/>))}
      </Route>
      <Route path='*' element={<Navigate to='/'/>}/>
    </Routes>
  );
};
