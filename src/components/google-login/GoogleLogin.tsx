import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { GoogleLogin, GoogleLoginResponse, GoogleLogout } from 'react-google-login';
import { Student } from '../../interfaces/student';
import { Role } from '../../interfaces/user';
import { AppContext } from '../../services/contexts/app-context';

export function GoogleButton(): JSX.Element {
  const {
    user, setUser,
  } = useContext(AppContext);
  const [{ CookieConsent }, , removeCookie] = useCookies(['CookieConsent']);
  return (
    !user ? (
      <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID as string}
        buttonText="login"
        className="btn nav-items login-btn btn-primary"
        disabled={CookieConsent !== 'true'}
        onSuccess={async (response) => {
          const onlineResp = response as GoogleLoginResponse;
          if (onlineResp.profileObj) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { profileObj: { email, name }, accessToken } = onlineResp;
            try {
              // await postUser(accessToken);
              // throw new Error('acb');
              setUser({
                role: Role.STUDENT,
                student: new Student({
                  _id: '',
                  email,
                  name,
                  usosId: '',
                  registeredAt: new Date(),
                  contactEmail: '',
                }),
              });
              // throw new Error('acb');
            } catch (e) {
              setUser(null);
            }
          }
        }}
        onFailure={(args) => {
          console.error('error', args);
          setUser(null);
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
          removeCookie('authorization');
          setUser(null);
        }}
      />
    )
  );
}
