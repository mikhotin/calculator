import { createContext, ReactNode, useMemo, useReducer } from 'react';
import axios from 'axios';

import { AuthService } from '@app/services';
import { ENDPOINTS } from '@app/api';
import { AuthResponse } from '@app/models/response/AuthResponse';
import { User } from '@app/models/user/User';

import { Action, ACTIONS, AuthContextType, InitialState } from './types';

const initialContext: AuthContextType = {
  isAuth: false,
  isLoading: false,
  user: {} as User,
  login: () => {},
  logout: () => {},
  registration: () => {},
  checkAuth: () => {},
};

const initialStateReducer: InitialState = {
  isAuth: false,
  isLoading: false,
  user: {} as User,
};

function reducer(state: InitialState, action: Action): InitialState {
  switch (action.type) {
    case ACTIONS.SET_AUTH:
      return { ...state, isAuth: action.payload.isAuth };
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload.user };
    case ACTIONS.LOADING:
      return { ...state, isLoading: action.payload.isLoading };
    default:
      return state;
  }
}

export const AuthContext = createContext(initialContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialStateReducer);
  const { isAuth, isLoading, user } = state;

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('token', response.data.accessToken);
      dispatch({ type: ACTIONS.SET_AUTH, payload: { isAuth: true } });
      dispatch({ type: ACTIONS.SET_USER, payload: { user: response.data.user } });
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  };

  const registration = async (email: string, password: string) => {
    try {
      const response = await AuthService.registration(email, password);
      localStorage.setItem('token', response.data.accessToken);
      dispatch({ type: ACTIONS.SET_AUTH, payload: { isAuth: true } });
      dispatch({ type: ACTIONS.SET_USER, payload: { user: response.data.user } });
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  };

  const logout = async () => {
    console.log('logout');
    try {
      const response = await AuthService.logout();
      localStorage.removeItem('token');
      dispatch({ type: ACTIONS.SET_AUTH, payload: { isAuth: false } });
      dispatch({ type: ACTIONS.SET_USER, payload: { user: {} as User } });
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  };

  const checkAuth = async () => {
    console.log('checkAuth');
    dispatch({ type: ACTIONS.LOADING, payload: { isLoading: true } });
    try {
      const response = await axios.get<AuthResponse>(`${ENDPOINTS.REFRESH}`, {
        withCredentials: true,
      });

      localStorage.setItem('token', response.data.accessToken);

      dispatch({ type: ACTIONS.SET_AUTH, payload: { isAuth: true } });
      dispatch({ type: ACTIONS.SET_USER, payload: { user: response.data.user } });
      dispatch({ type: ACTIONS.LOADING, payload: { isLoading: false } });
    } catch (e: any) {
      console.log(e, 'error');
      dispatch({ type: ACTIONS.LOADING, payload: { isLoading: false } });
      console.log(e.response?.data?.message);
    }
  };

  const contextValues = useMemo(
    () => ({
      isAuth,
      isLoading,
      user,
      login,
      logout,
      registration,
      checkAuth,
    }),
    [isAuth, isLoading, user, login, logout, registration, checkAuth]
  );

  return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>;
};
