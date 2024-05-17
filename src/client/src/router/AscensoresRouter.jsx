import React from 'react';
import { Route } from 'react-router-dom';
import { Main, IndexPage } from '../components';
import { routesList } from './RoutesList';

export const AscensoresRouter = () => {
  return (
    <Route exact path='/' element={<Main />}>
      <Route index element={<IndexPage />} />
      {routesList.map(({ path, RouteComponent }) => (
        <Route exact path={path} element={<RouteComponent />} />
      ))}
    </Route>
  );
};
