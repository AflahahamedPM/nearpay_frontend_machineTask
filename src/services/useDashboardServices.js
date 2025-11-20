import React, { useCallback, useEffect, useState } from "react";
import APIRequest from "../utils/APIRequest";
import { API_ENDPOINTS } from "../config/ConfigAPIURL";
import { CheckValidation } from "../utils/Validation";
import useAlert from "../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const categoryDetails = {
  name: "",
  color: "",
};
const useDashboardServices = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showSubMenu, setShowSubMenu] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState(categoryDetails);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [budgetData, setBudgetData] = useState([]);
  const [changedBudgetIds, setChangedBudgetIds] = useState(new Set());

  const navigate = useNavigate();

  const { publishNotification } = useAlert();

  useEffect(() => {
    if (currentPage === "categories") {
      fetchAllCategories();
    }
  }, [currentPage]);

  useEffect(() => {
    if (dateRange?.startDate !== null && currentPage === "budgets") {
      getBudgetDatas();
    }
  }, [dateRange]);

  const fetchAllCategories = async () => {
    try {
      const response = await APIRequest.request(
        "GET",
        API_ENDPOINTS?.allCategories
      );
      if (response?.data?.responseCode === 109) {
        setCategoriesData(response?.data?.result);
      } else if (response?.data?.responseCode === 108) {
        publishNotification(response?.data?.message, "error");
        navigate("/login");
      } else {
        publishNotification(
          response?.data?.message || "Error while fetching categories",
          "error"
        );
      }
    } catch (error) {
      publishNotification(
        error?.message ?? "Error while fetching categories",
        "error"
      );
    }
  };

  const submitCategoryForm = async (isEditing) => {
    try {
      const missingFields = CheckValidation(categoryForm);

      if (missingFields?.length > 0) {
        publishNotification("Please fill all the mandatory fields", "error");
        return;
      }

      const url = isEditing
        ? API_ENDPOINTS?.updateCategory
        : API_ENDPOINTS?.createCategory;
      const response = await APIRequest.request(
        "POST",
        url,
        JSON.stringify({ ...categoryForm, ...dateRange })
      );

      const responseCode = response?.data?.responseCode;
      const message = response?.data?.message;
      if (responseCode === 109) {
        publishNotification(message, "success");
        setIsCategoryModalOpen(false);
        fetchAllCategories();
        setCategoryForm(categoryDetails);
      } else {
        publishNotification(message, "error");
      }
    } catch (error) {
      publishNotification(error?.message, "error");
    }
  };

  const handleEditCategory = (selectedCategory) => {
    setCategoryForm((prev) => ({
      ...prev,
      ...selectedCategory,
    }));

    setIsCategoryModalOpen(true);
  };

  const deleteCategory = async (recordId) => {
    try {
      const response = await APIRequest.request(
        "POST",
        API_ENDPOINTS?.deleteCategory,
        JSON.stringify({ recordId: recordId })
      );
      if (response?.data?.responseCode === 109) {
        publishNotification(response?.data?.message, "success");
        fetchAllCategories();
      } else {
        publishNotification(response?.data?.message, "error");
      }
    } catch (error) {
      publishNotification(
        error?.message ?? "Error while deleting the category",
        "error"
      );
    }
  };

  function getMonthRangeIST(date) {
    const year = date.year();
    const month = date.month();

    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    return {
      startDate: Math.floor(start.getTime() / 1000),
      endDate: Math.floor(end.getTime() / 1000),
    };
  }

  useEffect(() => {
    const now = dayjs();

    const { startDate, endDate } = getMonthRangeIST(now);
    setDateRange({ startDate, endDate });

    setSelectedMonth(now);
  }, [currentPage]);

  const handleMonthChange = useCallback((val) => {
    if (!val) return;

    setSelectedMonth(val);

    const { startDate, endDate } = getMonthRangeIST(val);
    setDateRange({ startDate, endDate });
  }, []);

  const getBudgetDatas = async () => {
    try {
      const response = await APIRequest.request(
        "POST",
        API_ENDPOINTS?.fetchBudgets,
        JSON.stringify(dateRange)
      );
      if (response?.data?.responseCode === 109) {
        setBudgetData(response?.data?.result);
        publishNotification(response?.data?.message, "success");
      } else if (response?.data?.responseCode === 108) {
        publishNotification(response?.data?.message, "error");
      } else {
        publishNotification(response?.data?.message, "error");
      }
    } catch (error) {
      publishNotification(
        error?.message ?? "Error while fetching the budget datas",
        "error"
      );
    }
  };

  const handleBudgetChange = useCallback(
    (itemId, value) => {
      const newValue = value === "" ? "" : Number(value);

      setBudgetData((prev = []) =>
        prev.map((item) =>
          item?._id === itemId ? { ...item, maxBudget: newValue } : item
        )
      );

      setChangedBudgetIds((s) => new Set(s).add(itemId));
    },
    [setBudgetData]
  );

  const prepareUpdates = () => {
    if (!budgetData) return [];
    return budgetData
      .filter((item) => changedBudgetIds.has(item._id))
      .map((item) => ({
        _id: item._id,
        maxBudget: item.maxBudget === "" ? 0 : Number(item.maxBudget),
      }));
  };

  const handleBudgetSave = async () => {
    const updates = prepareUpdates();
    if (updates.length === 0) {
      publishNotification("No changes to save", "info");
      return;
    }

    try {
      const response = await APIRequest.request(
        "POST",
        API_ENDPOINTS.updateBudgetsBulk,
        JSON.stringify({ updates })
      );

      if (response?.data?.responseCode === 109) {
        publishNotification("Budgets saved", "success");
        setDirtyIds(new Set());
        getBudgetDatas();
      } else {
        publishNotification(response?.data?.message ?? "Save failed", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      publishNotification(err?.message ?? "Network error", "error");
    }
  };

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
    handleEditCategory,
    categoryDetails,
    deleteCategory,
    handleMonthChange,
    selectedMonth,
    budgetData,
    setBudgetData,
    handleBudgetSave,
    handleBudgetChange,
  };
};

export default useDashboardServices;
