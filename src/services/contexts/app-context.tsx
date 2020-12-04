import React from 'react';
import { IUser } from '../../interfaces/user';

export interface AppContextProps {
  loggedIn: boolean
  user?: IUser
  setLoggedIn: (v: boolean) => void
  setUser: (u?: IUser) => void
}

export const AppContext = React.createContext<AppContextProps>({
  loggedIn: false,
  setLoggedIn: () => null,
  setUser: () => null,
});
