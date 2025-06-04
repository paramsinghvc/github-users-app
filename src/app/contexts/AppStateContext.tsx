/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { RankedGithubUser } from '@/lib/github-service';
import React, { createContext, useContext, useState } from 'react';

type AppState = {
  loadedUsers: RankedGithubUser[];
  selectedUser?: RankedGithubUser;
};

type AppStateContextType = {
  state: AppState;
  set: <T = any>(key: keyof AppState, value: T) => void;
  get: <K extends keyof AppState>(key: K) => AppState[K];
  clear: (key: keyof AppState) => void;
};

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export const AppStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<AppState>({ loadedUsers: [] });

  const set = <T,>(key: keyof AppState, value: T) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const get = <K extends keyof AppState>(key: K): AppState[K] => state[key];

  const clear = (key: keyof AppState) => {
    setState((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  return (
    <AppStateContext.Provider value={{ state, set, get, clear }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context)
    throw new Error('useAppState must be used within AppStateProvider');
  return context;
};
