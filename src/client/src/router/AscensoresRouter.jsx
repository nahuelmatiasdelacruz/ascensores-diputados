import React from 'react';
import { Route } from 'react-router-dom';
import Main from '../components/Main/Main';
import Index from '../components/Main/Routes';
import { routesList } from './RoutesList';

export const AscensoresRouter = () => {
  return (
    <Route exact path='/' element={<Main />}>
      <Route index element={<Index />} />
      {routesList.map(({ path, RouteComponent }) => (
        <Route exact path={path} element={<RouteComponent />} />
      ))}
    </Route>
  );
};
