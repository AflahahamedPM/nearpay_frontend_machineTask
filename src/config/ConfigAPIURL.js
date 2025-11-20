export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  userLogin: "/login",
  register: "/register",
  allCategories: "/categories",
  createCategory: "/category/create",
  updateCategory: "/category/update",
  deleteCategory: "/category/delete",
  fetchBudgets: "/budgets",
  updateBudgetsBulk: "/budgets/update",
  budgetCreation: "/budget/create",
  expenses: "/expenses",
  createExpense: "/expense/create",
};

export const getApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
