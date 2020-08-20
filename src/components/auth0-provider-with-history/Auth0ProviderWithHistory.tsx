import React from 'react';
import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

function Auth0ProviderWithHistory(props: React.PropsWithChildren<unknown>) {
  const { children } = props;
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    throw new Error('Auth0 env variables missing');
  }

  const history = useHistory();

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={() => {
        history.push(window.location.pathname);
      }}
    >
      {children}
    </Auth0Provider>
  );
}

export default Auth0ProviderWithHistory;
