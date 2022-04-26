import { User } from "firebase/auth";
import React, { useContext } from "react";

export interface IGlobalState {
  state: {
    isLoggedIn: boolean;
    user?: User;
    spinnerStatus: boolean;
    showSpinner: () => void;
    hideSpinner: () => void;
  };
}
export const defaultState: IGlobalState = {
  state: {
    isLoggedIn: false,
    spinnerStatus: false,
    showSpinner: () => {},
    hideSpinner: () => {},
  },
};

export const GlobalContext = React.createContext<IGlobalState>(defaultState);

export const useGlobalContext = () => useContext(GlobalContext);
