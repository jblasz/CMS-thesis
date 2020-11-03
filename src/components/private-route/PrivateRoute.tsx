import React, { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AppContext } from '../../services/contexts/app-context';

function PrivateRoute(props: RouteProps) {
  const { component, ...other } = props;
  const { loggedIn } = useContext(AppContext);
  if (!component) {
    throw new Error('Component missing?');
  }
  if (!loggedIn) {
    return <Redirect to="/404" />;
  }
  return (
    <Route
      component={component}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    />
  );
}

export default PrivateRoute;
