import React from 'react';
import ReactDOM from 'react-dom';
// load bootstrap styles
import 'bootstrap/dist/css/bootstrap.css';

import './index.css';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app/App';
import * as serviceWorker from './serviceWorker';

import { populateInMemoryDBWithSomeMocks } from './services/mocks/in-memory-course-mocks';
import { Auth0ProviderWithHistory } from './components/auth0-provider-with-history';
import i18n from './services/i18n/i18n';

// load mocks
populateInMemoryDBWithSomeMocks();

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <Auth0ProviderWithHistory>
        <App />
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  </I18nextProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
