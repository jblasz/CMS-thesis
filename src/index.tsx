import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import App from './components/app/App';
import * as serviceWorker from './serviceWorker';
import commonEN from './translations/en/common.json';
import commonPL from './translations/pl/common.json';
import landingEN from './translations/en/landing.json';
import landingPL from './translations/pl/landing.json';

// load bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css';

// load translations
i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'en',
  resources: {
    en: {
      common: commonEN,
      landing: landingEN,
    },
    pl: {
      common: commonPL,
      landing: landingPL,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
