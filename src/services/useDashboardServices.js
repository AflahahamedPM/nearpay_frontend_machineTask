// useDashboardServices.js (refactored)
import { useCallback, useEffect, useRef, useState } from "react";
import APIRequest from "../utils/APIRequest";
import { API_ENDPOINTS } from "../config/ConfigAPIURL";
import { CheckValidation } from "../utils/Validation";
import useAlert from "../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const categoryDetails = { name: "", color: "" };
const budgetDetails = { categoryId: "", month: null, maxBudget: 0 };
const expenseDetails = { categoryId: "", date: null, spendAmount: 0 };

const monthEpochFrom = (val) =>
  Math.floor(dayjs(val).startOf("month").valueOf() / 1000);

const useDashboardServices = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showSubMenu, setShowSubMenu] = useState(null);

  const [categoriesData, setCategoriesData] = useState([]);
  const [categoryForm, setCategoryForm] = useState(categoryDetails);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [budgetForm, setBudgetForm] = useState(budgetDetails);
  const [budgetData, setBudgetData] = useState([]);
  const [changedBudgetIds, setChangedBudgetIds] = useState(() => new Set());
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const [expenseForm, setExpenseForm] = useState(expenseDetails);
  const [expenseData, setExpenseData] = useState([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(() =>
    monthEpochFrom(dayjs())
  );
  const [selectedExpenseMonth, setSelectedExpenseMonth] = useState(() =>
    monthEpochFrom(dayjs())
  );

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { publishNotification } = useAlert();

  /* --------------------- API: categories --------------------- */

  const fetchAllCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await APIRequest.request(
        "GET",
        API_ENDPOINTS?.allCategories
      );
      if (response?.data?.responseCode === 109) {
        setCategoriesData(response?.data?.result || []);
      } else if (response?.data?.responseCode === 108) {
        publishNotification(response?.data?.message, "error");
        navigate("/login");
      } else {
        publishNotification(
          response?.data?.message || "Error while fetching categories",
          "error"
        );
      }
    } catch (err) {
      publishNotification(
        err?.message ?? "Error while fetching categories",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate, publishNotification]);

  useEffect(() => {
    if (
      currentPage === "categories" ||
      currentPage === "budgets" ||
      currentPage === "dashboard"
    ) {
      fetchAllCategories();
    }
  }, [currentPage]);

  const handleEditCategory = (data) => {
    setIsCategoryModalOpen(true);
    setCategoryForm((prev) => ({
      ...prev,
      ...data,
    }));
  };

  /* --------------------- Budgets --------------------- */

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await APIRequest.request(
        "POST",
        API_ENDPOINTS?.fetchBudgets,
        JSON.stringify({ month: selectedMonth })
      );
      if (response?.data?.responseCode === 109) {
        setBudgetData(response?.data?.result || []);
      } else if (response?.data?.responseCode === 108) {
        publishNotification(response?.data?.message, "error");
      } else {
        publishNotification(
          response?.data?.message || "Error while fetching budgets",
          "error"
        );
      }
    } catch (err) {
      publishNotification(err?.message ?? "Network error", "error");
    } finally {
      setIsLoading(false);
    }
  }, [publishNotification]);

  useEffect(() => {
    if (currentPage === "budgets") {
      fetchBudgets();
    }
  }, [currentPage, selectedMonth]);

  const handleMonthChange = useCallback((val) => {
    if (!val) return;
    const epoch = monthEpochFrom(val);
    setSelectedMonth(epoch);
  }, []);

  const handleBudgetMonthChange = useCallback((val) => {
    if (!val) return;
    const epoch = monthEpochFrom(val);
    setBudgetForm((prev) => ({
      ...prev,
      month: epoch,
    }));
  }, []);

  const handleBudgetChange = useCallback((itemId, value) => {
    const newValue = value === "" ? "" : Number(value);
    setBudgetData((prev = []) =>
      prev.map((it) =>
        it?._id === itemId ? { ...it, maxBudget: newValue } : it
      )
    );
    setChangedBudgetIds((s) => {
      const copy = new Set(s);
      copy.add(itemId);
      return copy;
    });
  }, []);

  const prepareUpdates = useCallback(() => {
    return (budgetData || [])
      .filter((item) => changedBudgetIds.has(item._id))
      .map((item) => ({
        _id: item._id,
        maxBudget: item.maxBudget === "" ? 0 : Number(item.maxBudget),
      }));
  }, [budgetData, changedBudgetIds]);

  const handleBudgetSave = useCallback(async () => {
    const updates = prepareUpdates();
    if (!updates.length) {
      publishNotification("No changes to save", "info");
      return;
    }
    setIsLoading(true);
    try {
      const response = await APIRequest.request(
        "POST",
        API_ENDPOINTS.updateBudgetsBulk,
        JSON.stringify({ updates })
      );
      if (response?.data?.responseCode === 109) {
        publishNotification(response?.data?.message, "success");
        setChangedBudgetIds(new Set());
        fetchBudgets(selectedMonth);
      } else {
        publishNotification(response?.data?.message ?? "Save failed", "error");
      }
    } catch (err) {
      publishNotification(err?.message ?? "Network error", "error");
    } finally {
      setIsLoading(false);
    }
  }, [prepareUpdates, fetchBudgets, selectedMonth, publishNotification]);

  /* --------------------- Expenses --------------------- */

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await APIRequest.request(
        "POST",
        API_ENDPOINTS?.expenses,
        JSON.stringify({ month: selectedExpenseMonth })
      );
      if (response?.data?.responseCode === 109) {
        setExpenseData(response?.data?.result || []);
      } else {
        publishNotification(
          response?.data?.message || "Error while fetching expenses",
          "error"
        );
      }
    } catch (err) {
      publishNotification(err?.message ?? "Network error", "error");
    } finally {
      setIsLoading(false);
    }
  }, [publishNotification]);

  useEffect(() => {
    if (currentPage === "dashboard") {
      fetchExpenses();
    }
  }, [currentPage, selectedExpenseMonth]);

  const handleExpenseMonthChange = useCallback((val) => {
    if (!val) return;
    const epoch = monthEpochFrom(val);
    setSelectedExpenseMonth(epoch);
  }, []);

  const handleExpenseDateChange = useCallback((date) => {
    if (!date) return;
    const epoch = Math.floor(date.getTime() / 1000);
    setExpenseForm((prev) => ({
      ...prev,
      date: epoch,
    }));
  }, []);

  const createNewExpenses = useCallback(async () => {
    const missing = CheckValidation(expenseForm);
    if (missing?.length > 0) {
      publishNotification("Please fill all the mandatory fields", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await APIRequest.request(
        "POST",
        API_ENDPOINTS?.createExpense,
        JSON.stringify(expenseForm)
      );
      if (response?.data?.responseCode === 109) {
        publishNotification(response?.data?.message, "success");
        fetchExpenses();
        setIsExpenseModalOpen(false);
        setExpenseForm(expenseDetails);
      } else {
        publishNotification(
          response?.data?.message || "Error creating expense",
          "error"
        );
      }
    } catch (err) {
      publishNotification(err?.message ?? "Network error", "error");
    } finally {
      setIsLoading(false);
    }
  }, [expenseForm, fetchExpenses, selectedExpenseMonth, publishNotification]);

  /* --------------------- Category submit / delete --------------------- */

  const submitCategoryForm = useCallback(
    async (isEditing) => {
      const missingFields = CheckValidation(categoryForm);
      if (missingFields?.length > 0) {
        publishNotification("Please fill all the mandatory fields", "error");
        return;
      }
      setIsLoading(true);
      try {
        const url = isEditing
          ? API_ENDPOINTS?.updateCategory
          : API_ENDPOINTS?.createCategory;
        const response = await APIRequest.request(
          "POST",
          url,
          JSON.stringify({ ...categoryForm, month: selectedMonth })
        );
        if (response?.data?.responseCode === 109) {
          publishNotification(response?.data?.message, "success");
          setIsCategoryModalOpen(false);
          fetchAllCategories();
          setCategoryForm(categoryDetails);
        } else {
          publishNotification(response?.data?.message || "Error", "error");
        }
      } catch (err) {
        publishNotification(err?.message ?? "Network error", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [categoryForm, selectedMonth, fetchAllCategories, publishNotification]
  );

  const deleteCategory = useCallback(
    async (recordId) => {
      setIsLoading(true);
      try {
        const response = await APIRequest.request(
          "POST",
          API_ENDPOINTS?.deleteCategory,
          JSON.stringify({ recordId })
        );
        if (response?.data?.responseCode === 109) {
          publishNotification(response?.data?.message, "success");
          fetchAllCategories();
        } else {
          publishNotification(
            response?.data?.message || "Error deleting",
            "error"
          );
        }
      } catch (err) {
        publishNotification(err?.message ?? "Network error", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAllCategories, publishNotification]
  );

  /* --------------------- Create budget --------------------- */

  const createBudget = useCallback(async () => {
    const missingFields = CheckValidation(budgetForm);
    if (missingFields?.length > 0) {
      publishNotification("Please fill all the mandatory fields", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await APIRequest.request(
        "POST",
        API_ENDPOINTS?.budgetCreation,
        JSON.stringify(budgetForm)
      );
      if (response?.data?.responseCode === 109) {
        publishNotification(response?.data?.message, "success");
        fetchBudgets(selectedMonth);
        setIsBudgetModalOpen(false);
      } else {
        publishNotification(
          response?.data?.message || "Error creating budget",
          "error"
        );
      }
    } catch (err) {
      publishNotification(err?.message ?? "Network error", "error");
    } finally {
      setIsLoading(false);
    }
  }, [budgetForm, fetchBudgets, selectedMonth, publishNotification]);

  return {
    mobileMenuOpen,
    setMobileMenuOpen,
    currentPage,
    setCurrentPage,
    showSubMenu,
    setShowSubMenu,
    categoriesData,
    setIsCategoryModalOpen,
    isCategoryModalOpen,
    submitCategoryForm,
    setCategoryForm,
    categoryForm,
    categoryDetails,
    deleteCategory,
    handleMonthChange,
    selectedMonth,
    budgetData,
    setBudgetData,
    handleBudgetSave,
    handleBudgetChange,
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    budgetForm,
    setBudgetForm,
    budgetDetails,
    handleBudgetMonthChange,
    isLoading,
    isExpenseModalOpen,
    setIsExpenseModalOpen,
    selectedExpenseMonth,
    handleExpenseMonthChange,
    expenseDetails,
    expenseForm,
    setExpenseForm,
    handleExpenseDateChange,
    createBudget,
    createNewExpenses,
    expenseData,
    handleEditCategory,
    expenseDetails,
  };
};

export default useDashboardServices;
