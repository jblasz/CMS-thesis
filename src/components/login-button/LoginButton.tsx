import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  const [t] = useTranslation();
  return (
    <Button
      onClick={() => loginWithRedirect({})}
      variant="primary"
      className="btn-margin"
    >
      {t('LOGIN.LOGIN')}
    </Button>
  );
}

export default LoginButton;
