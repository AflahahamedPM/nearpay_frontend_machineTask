import React from "react";
import Header from "../header/Header";
import { useDashboardData } from "../../providers/DashboardProvider";
import DashboardComponent from "./DashboardComponent";
import ReportsComponent from "./ReportsComponent";
import CategoryComponent from "./CategoryComponent";
import BudgetComponent from "./BudgetComponent";

const DashboardContainer = () => {
  const { currentPage } = useDashboardData();
  return (
    <>
      <Header />
      {currentPage === "dashboard" ? (
        <DashboardComponent />
      ) : currentPage === "categories" ? (
        <CategoryComponent />
      ) : currentPage === "budgets" ? (
        <BudgetComponent />
      ) : (
        <ReportsComponent />
      )}
    </>
  );
};

export default DashboardContainer;
