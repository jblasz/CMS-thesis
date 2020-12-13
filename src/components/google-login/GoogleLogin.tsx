import React, { useContext, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { v4 } from 'uuid';
import { Student } from '../../interfaces/student';
import { Role } from '../../interfaces/user';
import { AppContext } from '../../services/contexts/app-context';
// import './GoogleLogin.scss';

export function GoogleButton(): JSX.Element {
  const {
    loggedIn, setLoggedIn, setUser,
  } = useContext(AppContext);
  const [{ CookieConsent }] = useCookies(['CookieConsent']);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; });
  return (
    !loggedIn ? (
      <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID as string}
        buttonText="login"
        className="btn nav-items login-btn btn-primary"
        disabled={CookieConsent !== 'true'}
        onSuccess={() => {
          if (!mounted.current) {
            return;
          }
          setLoggedIn(true);
          setUser({
            role: Role.STUDENT,
            student: new Student({
              _id: v4(),
              email: 'mail@domain.com',
              name: 'Henry Jekyll',
              usosId: '123456',
              registeredAt: new Date(),
              contactEmail: '',
            }),
          });
        }}
        onFailure={(args) => {
          console.error('error', args);
          if (!mounted.current) {
            return;
          }
          setLoggedIn(false);
          setUser();
        }}
        isSignedIn
        cookiePolicy="single_host_origin"
      />
    ) : (
      <GoogleLogout
        clientId={process.env.REACT_APP_CLIENT_ID as string}
        className="btn nav-items login-btn btn-primary"
        buttonText="logout"
        onLogoutSuccess={() => {
          if (!mounted.current) {
            return;
          }
          console.log('logout');
          setLoggedIn(false);
          setUser();
        }}
      />
    )
  );
}
