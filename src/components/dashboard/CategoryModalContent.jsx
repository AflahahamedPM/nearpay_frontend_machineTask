import React from "react";
import { Input } from "../ui/input";
import { useDashboardData } from "../../providers/DashboardProvider";
import { Button } from "../ui/button";

const CategoryModalContent = ({ isEditing }) => {
  const { categoryForm, setCategoryForm, submitCategoryForm } = useDashboardData();
  return (
    <div>
      <Input
        placeholder="Category Name"
        className="mb-4"
        value={categoryForm?.name}
        onChange={(e) =>
          setCategoryForm((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />
      <div className="relative w-full mb-4">
        <Input
          type="color"
          className="h-10 w-full p-1 cursor-pointer"
          value={categoryForm?.color || "#000000"}
          onChange={(e) =>
            setCategoryForm((prev) => ({
              ...prev,
              color: e.target.value,
            }))
          }
        />

        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium pointer-events-none text-gray-700">
          {categoryForm?.color?.toUpperCase()}
        </span>
      </div>

      <Button
        className="bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:text-white w-full"
        onClick={() => submitCategoryForm(isEditing)}
      >
        {isEditing ? "Update" : "Create"}
      </Button>
    </div>
  );
};

export default CategoryModalContent;
