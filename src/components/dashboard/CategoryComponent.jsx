import React from "react";
import { useDashboardData } from "../../providers/DashboardProvider";
import { Trash2, PencilIcon, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import Dialog from "../ReusableComponents/Dialog";
import CategoryModalContent from "./CategoryModalContent";

const CategoryComponent = () => {
  const {
    categoriesData,
    setIsCategoryModalOpen,
    isCategoryModalOpen,
    handleEditCategory,
    categoryDetails,
    setCategoryForm,
    categoryForm,
    deleteCategory,
  } = useDashboardData();

  return (
    <div className="p-6 mb-6 sm:w-1/2 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-700">Categories</h3>
        <Button
          variant="default"
          onClick={() => setIsCategoryModalOpen(true)}
          className="bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusCircle className="w-6 h-6" />
          Add Category
        </Button>
      </div>

      {categoriesData?.length === 0 ? (
        <p className="text-2xl font-bold flex justify-center items-center">
          No Categories
        </p>
      ) : (
        categoriesData?.map((data) => (
          <div
            key={data?._id}
            className={`p-3 border border-gray-400 rounded-xl flex justify-between items-center mb-3`}
          >
            <div className="flex gap-3 justify-center items-center">
              <div
                className="rounded-full h-6 w-6"
                style={{ backgroundColor: data?.color }}
              />
              <p className="text-lg font-semibold">{data?.name}</p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <PencilIcon
                className="size-6 text-blue-800 cursor-pointer"
                onClick={() => handleEditCategory(data)}
              />
              <Trash2
                className="size-6 text-red-800 cursor-pointer"
                onClick={() => deleteCategory(data?._id)}
              />
            </div>
          </div>
        ))
      )}

      {isCategoryModalOpen && (
        <Dialog
          isOpen={isCategoryModalOpen}
          handleClose={() => {
            setIsCategoryModalOpen(false);
            setCategoryForm(categoryDetails);
          }}
          title={categoryForm?._id ? "Edit Category" : "Create Category"}
          child={<CategoryModalContent isEditing={categoryForm?._id} />}
        />
      )}
    </div>
  );
};

export default CategoryComponent;
