import React from 'react';
import logo from '../../images/logo.svg';
import './App.css';
import { useApp } from './hooks';
import { NavigationBar } from '../navbar';

function App(): JSX.Element {
  const { welcomeMessage } = useApp();
  // const { t, i18n } = useTranslation('common');
  return (
    <div className="App">
      <NavigationBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          { welcomeMessage }
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
