import React, { useContext } from 'react';

import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { AppContext } from '../../services/contexts/app-context';

export function GoogleButton(): JSX.Element {
  const { loggedIn, setLoggedIn } = useContext(AppContext);
  return (
    !loggedIn ? (
      <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID as string}
        buttonText="login"
        onSuccess={() => {
          setLoggedIn(true);
        }}
        onFailure={(args) => {
          console.error('error', args);
          setLoggedIn(false);
        }}
        isSignedIn
        cookiePolicy="single_host_origin"
      />
    ) : (
      <GoogleLogout
        clientId={process.env.REACT_APP_CLIENT_ID as string}
        buttonText="logout"
        onLogoutSuccess={() => {
          console.log('logout');
          setLoggedIn(false);
        }}
      />
    )
  );
}
