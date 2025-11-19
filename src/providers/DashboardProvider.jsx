import React, { createContext, useContext } from "react";
import useDashboardServices from "../services/useDashboardServices";

const DashboardContext = createContext(null);

export const DashboardProvider = ({children}) => {
  const services = useDashboardServices();
  return <DashboardContext.Provider value={services}>{children}</DashboardContext.Provider>;
};

export const useDashboardData = () => useContext(DashboardContext);
