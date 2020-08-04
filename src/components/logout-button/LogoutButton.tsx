import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function LogoutButton() {
  const { logout } = useAuth0();
  const [t] = useTranslation();
  return (
    <Button
      onClick={() => logout({
        returnTo: window.location.origin,
      })}
      variant="danger"
      className="btn-margin"
    >
      {t('LOGIN.LOGOUT')}
    </Button>
  );
}

export default LogoutButton;
