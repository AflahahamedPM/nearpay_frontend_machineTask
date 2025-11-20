import React from "react";
import { Input } from "../ui/input";
import { useDashboardData } from "../../providers/DashboardProvider";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BudgetModalContent = () => {
  const {
    budgetForm,
    setBudgetForm,
    createBudget,
    categoriesData = [],
    handleBudgetMonthChange,
  } = useDashboardData();

  console.log(budgetForm, "budgetForm");
  return (
    <div>
      <Select
        value={budgetForm?.categoryId || ""}
        onValueChange={(val) => {
          setBudgetForm((prev) => ({
            ...prev,
            categoryId: val,
          }));
        }}
        className="mb-4"
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categoriesData?.length > 0 ? (
            categoriesData.map((data) => (
              <SelectItem key={data?._id} value={data?._id}>
                {data?.name}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-1 text-sm text-gray-500">
              No categories available
            </div>
          )}
        </SelectContent>
      </Select>

      <Input
        placeholder="Budget"
        className="my-4"
        value={budgetForm?.maxBudget}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            setBudgetForm((prev) => ({
              ...prev,
              maxBudget: Number(value),
            }));
          }
        }}
      />

      <DatePicker
        selected={
          budgetForm?.month
            ? new Date(dayjs.unix(budgetForm.month).toISOString())
            : null
        }
        onChange={(date) => {
          handleBudgetMonthChange(date);
        }}
        maxDate={new Date()}
        dateFormat="MM-yyyy"
        className="border sm:w-115 w-85 mb-3 p-2 rounded-md"
        placeholderText="Select Month"
        fullWidth
        showMonthYearPicker
      />

      <Button
        className="bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:text-white w-full"
        onClick={createBudget}
      >
        Create
      </Button>
    </div>
  );
};

export default BudgetModalContent;
