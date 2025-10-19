import React, { createContext, useState, useContext } from 'react';

const UserCurrencyContext = createContext();

export const useUserCurrency = () => {
  return useContext(UserCurrencyContext);
};

export const UserCurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  const value = {
    currency,
    setCurrency,
  };

  return (
    <UserCurrencyContext.Provider value={value}>
      {children}
    </UserCurrencyContext.Provider>
  );
};
