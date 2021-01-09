import React, { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { Role } from '../../interfaces/user';
import { AppContext } from '../../services/contexts/app-context';

interface PrivateRouteProps extends RouteProps {
  admin: boolean
}

function PrivateRoute(props: PrivateRouteProps) {
  const { component, admin, ...other } = props;
  const { user } = useContext(AppContext);
  if (!component) {
    throw new Error('Component missing?');
  }
  if (!user || (admin && user.role !== Role.ADMIN)) {
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
