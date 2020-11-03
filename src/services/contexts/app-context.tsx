import React from 'react';

export interface AppContextProps {
  loggedIn: boolean
  setLoggedIn: (v: boolean) => void
}

export const AppContext = React.createContext<AppContextProps>({
  loggedIn: false,
  setLoggedIn: () => null,
});
