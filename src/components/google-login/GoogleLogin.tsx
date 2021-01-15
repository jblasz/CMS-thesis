import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { GoogleLogin, GoogleLoginResponse, GoogleLogout } from 'react-google-login';
import { useTranslation } from 'react-i18next';
import { Student } from '../../interfaces/student';
import { Role } from '../../interfaces/user';
import { postUser } from '../../services/api/user.service';
import { AppContext } from '../../services/contexts/app-context';

export function GoogleButton(): JSX.Element {
  const {
    user, setUser,
  } = useContext(AppContext);
  const [{ CookieConsent }, , removeCookie] = useCookies(['CookieConsent']);
  const [t] = useTranslation();
  return (
    !user ? (
      <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID as string}
        buttonText={t('LOGIN.LOGIN')}
        className="btn nav-items login-btn btn-primary"
        disabled={CookieConsent !== 'true'}
        onSuccess={async (response) => {
          const onlineResp = response as GoogleLoginResponse;
          if (onlineResp.profileObj) {
            const {
              profileObj: { email, name }, tokenId, googleId,
            } = onlineResp;
            try {
              const { student } = await postUser(tokenId, googleId, email, name, '123456');
              setUser({
                role: Role.ADMIN,
                student: new Student(student),
              });
            } catch (e) {
              console.error('google signin success, but backend request errored', e);
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
        buttonText={t('LOGIN.LOGOUT')}
        onLogoutSuccess={() => {
          console.log('logout');
          removeCookie('authorization');
          setUser(null);
        }}
      />
    )
  );
}
