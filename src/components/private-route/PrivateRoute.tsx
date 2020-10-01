import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { LoadingSpinner } from '../loading-spinner';

function PrivateRoute(props: RouteProps) {
  const { component, ...other } = props;
  if (!component) {
    throw new Error('Component missing?');
  }
  return (
    <Route
      component={withAuthenticationRequired(component, {
        onRedirecting: () => <LoadingSpinner />,
      })}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    />
  );
}

export default PrivateRoute;
