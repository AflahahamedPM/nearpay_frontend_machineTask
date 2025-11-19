import React, { createContext, useContext } from "react";
import useAuthServices from "../services/useAuthServices";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const services = useAuthServices();
  return <AuthContext.Provider value={services}>{children}</AuthContext.Provider>;
};

export const useAuthData = () => useContext(AuthContext);
