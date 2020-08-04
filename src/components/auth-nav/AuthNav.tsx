import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LogoutButton } from '../logout-button';
import { LoginButton } from '../login-button';

function AuthNav() {
  const { isAuthenticated, user } = useAuth0();
  const [t] = useTranslation();
  return (
    <Navbar className="justify-content-end">
      {
        isAuthenticated ? (
          <Navbar.Text className="mr-2">
            {`${t('LOGIN.LOGGED_IN_AS')}:`}
            {' '}
            <Link to="/profile">{user.email}</Link>
          </Navbar.Text>
        ) : (
          <Navbar.Text className="mr-2">
            {t('LOGIN.NOT_LOGGED_IN')}
          </Navbar.Text>
        )
      }
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </Navbar>
  );
}

export default AuthNav;
