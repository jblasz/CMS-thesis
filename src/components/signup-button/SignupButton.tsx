import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  const [t] = useTranslation();
  return (
    <Button
      onClick={() => loginWithRedirect({
        screen_hint: 'signup',
      })}
      variant="primary"
      className="btn-margin"
    >
      {t('LOGIN.SIGNUP')}
    </Button>
  );
};

export default SignupButton;
