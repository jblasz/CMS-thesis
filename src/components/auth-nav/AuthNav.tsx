import React, { useContext } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import polishFlag from '../../images/poland.svg';
import britishFlag from '../../images/uk.svg';
import './AuthNav.scss';
import { AppContext } from '../../services/contexts/app-context';
import { GoogleButton } from '../google-login/GoogleLogin';
import { Role } from '../../interfaces/user';

function AuthNav() {
  const [t, i18n] = useTranslation();
  const { loggedIn, user } = useContext(AppContext);

  return (
    <div>
      {
        loggedIn && user ? (
          <Navbar.Text className="p-2">
            <Link to="/profile">{`${t('LOGIN.LOGGED_IN_AS')}: ${user.student.name}${user.role === Role.ADMIN ? '(ADMIN)' : ''}`}</Link>
          </Navbar.Text>
        ) : (
          <Navbar.Text className="p-2">
            {t('LOGIN.NOT_LOGGED_IN')}
          </Navbar.Text>
        )
      }
      <GoogleButton />
      <Button className="flag-wrapper nav-items" onClick={() => { i18n.changeLanguage(i18n.language === 'en' ? 'pl' : 'en'); }}>
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
