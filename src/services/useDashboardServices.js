import React, { useEffect, useState } from "react";
import APIRequest from "../utils/APIRequest";
import { API_ENDPOINTS } from "../config/ConfigAPIURL";
import { CheckValidation } from "../utils/Validation";
import useAlert from "../hooks/useAlert";

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

  const { publishNotification } = useAlert();

  useEffect(() => {
    if (currentPage === "categories") {
      fetchAllCategories();
    }
  }, [currentPage]);

  const fetchAllCategories = async () => {
    try {
      const response = await APIRequest.request(
        "GET",
        API_ENDPOINTS?.allCategories
      );
      if (response?.data?.responseCode === 109) {
        setCategoriesData(response?.data?.result);
      } else {
        publishNotification(
          response?.data?.message ?? "Error while fetching categories",
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
        JSON.stringify(categoryForm)
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
  };
};

export default useDashboardServices;
