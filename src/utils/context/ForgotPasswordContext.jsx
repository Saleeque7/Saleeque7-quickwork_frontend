

import React, { createContext, useContext, useEffect, useState } from "react";

const ForgotContext = createContext();

export const ForgotPassContextProvider = ({ children }) => {
  const [passwordPage, setPasswordPage] = useState(false);

  return (
    <ForgotContext.Provider value={{ passwordPage, setPasswordPage }}>
      {children}
    </ForgotContext.Provider>
  );
};

export const useForgotPage = () => useContext(ForgotContext);
