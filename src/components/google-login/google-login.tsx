import React, { useContext } from 'react';

import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { AppContext } from '../../services/contexts/app-context';

export function GoogleButton(): JSX.Element {
  const { loggedIn, setLoggedIn } = useContext(AppContext);
  return (
    !loggedIn ? (
      <GoogleLogin
        clientId="593522798742-q10ne2vss3meepaca30vd6lrffkfkauh.apps.googleusercontent.com"
        buttonText="login"
        onSuccess={(args) => {
          console.log(args);
          setLoggedIn(true);
        }}
        onFailure={(args) => {
          console.log('error', args);
        }}
        isSignedIn
        cookiePolicy="single_host_origin"
      />
    ) : (
      <GoogleLogout
        clientId="593522798742-q10ne2vss3meepaca30vd6lrffkfkauh.apps.googleusercontent.com"
        buttonText="logout"
        onLogoutSuccess={() => {
          console.log('logout');
        }}
      />
    )
  );
}
