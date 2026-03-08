/**
 * LiveDataContext — Global real-time data store
 * Saare pages is context se live data lete hain
 */
import React, { createContext, useContext } from 'react';
import { useLiveData } from '../hooks/useLiveData';

const LiveDataContext = createContext(null);

export function LiveDataProvider({ children }) {
  const liveData = useLiveData(3000); // update every 3 seconds
  return (
    <LiveDataContext.Provider value={liveData}>
      {children}
    </LiveDataContext.Provider>
  );
}

export const useLive = () => {
  const ctx = useContext(LiveDataContext);
  if (!ctx) throw new Error('useLive must be used inside LiveDataProvider');
  return ctx;
};
