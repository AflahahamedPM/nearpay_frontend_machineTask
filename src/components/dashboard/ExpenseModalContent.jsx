import React from "react";
import { useDashboardData } from "../../providers/DashboardProvider";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";


const ExpenseModalContent = ({ selectedExpenseMonth }) => {
  const {
    categoriesData,
    expenseForm,
    setExpenseForm,
    handleExpenseDateChange,
    createNewExpenses,
  } = useDashboardData();

  return (
    <div>
      <Select
        value={expenseForm?.categoryId || ""}
        onValueChange={(val) => {
          setExpenseForm((prev) => ({
            ...prev,
            categoryId: val,
          }));
        }}
        className="mb-4"
      >
        <SelectTrigger>
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
        placeholder="Amount"
        className="my-4"
        value={expenseForm?.spendAmound}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            setExpenseForm((prev) => ({
              ...prev,
              spendAmount: Number(value),
            }));
          }
        }}
      />

      <div className="my-4">
        <label className="block mb-2 text-sm text-gray-600">Expense Date</label>

        <DatePicker
          selected={
            expenseForm?.date
              ? new Date(dayjs.unix(expenseForm.date).toISOString())
              : null
          }
          minDate={selectedExpenseMonth}
          onChange={(date) => {
            handleExpenseDateChange(date);
          }}
          maxDate={new Date()}
          dateFormat="dd-MM-yyyy"
          className="border sm:w-115 w-85 p-2 rounded-md"
          placeholderText="Select Date"
        />
      </div>

      <Button
        onClick={createNewExpenses}
        className="bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:text-white w-full"
      >
        Create
      </Button>
    </div>
  );
};

export default ExpenseModalContent;
