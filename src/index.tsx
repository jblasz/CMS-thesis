import React from 'react';
import ReactDOM from 'react-dom';
// load bootstrap styles
import 'bootstrap/dist/css/bootstrap.css';

import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { App } from './components/app';
import * as serviceWorker from './serviceWorker';
import i18n from './services/i18n/i18n';
import { populateInMemoryDBWithSomeMocks } from './services/mocks';

// datepicker style
import 'react-datepicker/dist/react-datepicker.css';

// load mocks
populateInMemoryDBWithSomeMocks();

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </I18nextProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
