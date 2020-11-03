import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SignupButton = () => {
  const [t] = useTranslation();
  return (
    <Button
      variant="primary"
      className="btn-margin"
    >
      {t('LOGIN.SIGNUP')}
    </Button>
  );
};

export default SignupButton;
