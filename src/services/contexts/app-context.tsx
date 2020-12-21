import React from 'react';
import { IUser } from '../../interfaces/user';

export interface AppContextProps {
  user: IUser | null
  setUser: (u: IUser | null) => void
}

export const AppContext = React.createContext<AppContextProps>({
  user: null,
  setUser: () => null,
});
