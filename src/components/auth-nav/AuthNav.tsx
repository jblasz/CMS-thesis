import React, { useContext } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import polishFlag from '../../images/poland.svg';
import britishFlag from '../../images/uk.svg';
import './AuthNav.css';
import { AppContext } from '../../services/contexts/app-context';
import { GoogleButton } from '../google-login/google-login';

function AuthNav() {
  const [t, i18n] = useTranslation();
  const { loggedIn } = useContext(AppContext);

  return (
    <div
      className="social text-gray"
      // style={{
      //   width: '100%', padding: 0, margin: 0, display: 'flex', maxWidth: 300,
      // }}
    >
      {
        loggedIn ? (
          <Navbar.Text className="mr-2">
            {`${t('LOGIN.LOGGED_IN_AS')}:`}
            {' '}
            <Link to="/profile">{}</Link>
          </Navbar.Text>
        ) : (
          <Navbar.Text className="mr-2">
            {t('LOGIN.NOT_LOGGED_IN')}
          </Navbar.Text>
        )
      }
      <GoogleButton />
      <Button variant="light" className="flag-wrapper" onClick={() => { i18n.changeLanguage(i18n.language === 'en' ? 'pl' : 'en'); }}>
        {
          i18n.language === 'en'
            ? <img src={britishFlag} className="img-responsive flag" alt="britishFlag" />
            : <img src={polishFlag} className="img-responsive flag" alt="polishFlag" />
        }
      </Button>
    </div>
  );
}

export default AuthNav;
