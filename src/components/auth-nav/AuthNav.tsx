import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LogoutButton } from '../logout-button';
import { LoginButton } from '../login-button';
import polishFlag from '../../images/poland.svg';
import britishFlag from '../../images/uk.svg';
import './AuthNav.css';

function AuthNav() {
  const { isAuthenticated, user } = useAuth0();
  const [t, i18n] = useTranslation();
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
      <Button variant="light" className="flag-wrapper" onClick={() => { i18n.changeLanguage(i18n.language === 'en' ? 'pl' : 'en'); console.log('changing language'); }}>
        {
          i18n.language === 'en'
            ? <img src={britishFlag} className="img-responsive flag" alt="britishFlag" />
            : <img src={polishFlag} className="img-responsive flag" alt="polishFlag" />
        }
      </Button>
    </Navbar>
  );
}

export default AuthNav;
