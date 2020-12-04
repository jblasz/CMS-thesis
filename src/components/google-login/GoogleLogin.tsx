import React, { useContext } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { v4 } from 'uuid';
import { Student } from '../../interfaces/student';
import { Role } from '../../interfaces/user';
import { AppContext } from '../../services/contexts/app-context';
import './GoogleLogin.scss';

export function GoogleButton(): JSX.Element {
  const {
    loggedIn, setLoggedIn, setUser,
  } = useContext(AppContext);
  return (
    !loggedIn ? (
      <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID as string}
        buttonText="login"
        className="btn nav-items login-btn"
        onSuccess={() => {
          setLoggedIn(true);
          setUser({
            role: Role.STUDENT,
            student: new Student({
              _id: v4(),
              email: 'mail@domain.com',
              name: 'Henry Jekyll',
              usosId: '123456',
              registeredAt: new Date(),
            }),
          });
        }}
        onFailure={(args) => {
          console.error('error', args);
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
          console.log('logout');
          setLoggedIn(false);
          setUser();
        }}
      />
    )
  );
}
