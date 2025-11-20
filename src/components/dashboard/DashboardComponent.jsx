import React from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useDashboardData } from "../../providers/DashboardProvider";
import Dialogue from "../ReusableComponents/Dialog";
import ExpenseModalContent from "./ExpenseModalContent";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Spinner } from "@/components/ui/spinner";

const DashboardComponent = () => {
  const {
    setIsExpenseModalOpen,
    isExpenseModalOpen,
    selectedExpenseMonth,
    handleExpenseMonthChange,
    isLoading,
    expenseData,
    setExpenseForm,
    expenseDetails
  } = useDashboardData();

  const monthLabel = selectedExpenseMonth
    ? dayjs.unix(Number(selectedExpenseMonth)).format("MMM YYYY")
    : "No month selected";

  return (
    <div className="p-6 mb-6 sm:w-1/2 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-2xl mb-4 font-bold text-gray-700">
            {monthLabel}
          </h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Month"
              views={["month", "year"]}
              value={
                selectedExpenseMonth ? dayjs.unix(selectedExpenseMonth) : null
              }
              maxDate={dayjs()}
              onChange={handleExpenseMonthChange}
              className="max-sm:w-40"
            />
          </LocalizationProvider>
        </div>
        <Button
          variant="default"
          onClick={() => setIsExpenseModalOpen(true)}
          className="bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:text-white sm:px-4 px-2 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusCircle className="w-6 h-6" />
          Add Expense
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner className="size-8" />
        </div>
      ) : expenseData.length === 0 ? (
        <p className="text-2xl font-bold flex justify-center items-center">
          No Expenses
        </p>
      ) : (
        <div className="flex flex-col w-full  gap-6 mb-8">
          {expenseData?.map((cat, idx) => {
            const percentageRaw =
              cat?.spendAmount === 0 && cat?.maxBudget === 0
                ? 100
                : (cat?.spendAmount / cat?.maxBudget) * 100;

            const percentage = Math.min(Math.max(percentageRaw, 0), 100);

            const isOverBudget = cat.spendAmount > cat.maxBudget;

            return (
              <div
                key={cat?._id}
                className="bg-white rounded-xl shadow-md p-2 hover:shadow-xl transition-shadow border-t-4"
                style={{ borderColor: cat?.categoryDetails?.color }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{
                        backgroundColor: `${cat?.categoryDetails?.color}20`,
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: cat?.categoryDetails?.color }}
                      ></div>
                    </div>
                    <h3 className="font-bold text-gray-700">
                      {cat?.categoryDetails?.name}
                    </h3>
                  </div>
                  {isOverBudget && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      OVER BUDGET
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Spent</span>
                    <span className="font-semibold">
                      ₹{cat?.spendAmount} / ₹{cat?.maxBudget}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverBudget
                          ? "bg-red-500"
                          : "bg-linear-to-r from-green-400 to-emerald-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span
                    className={`font-semibold ${
                      isOverBudget ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    ₹{cat?.maxBudget - cat?.spendAmount} remaining
                  </span>
                  <span className="text-gray-500">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isExpenseModalOpen && (
        <Dialogue
          isOpen={isExpenseModalOpen}
          handleClose={() => {
            setIsExpenseModalOpen(false);
            setExpenseForm(expenseDetails)
          }}
          title={"Add new Expense"}
          child={
            <ExpenseModalContent
              selectedExpenseMonth={
                selectedExpenseMonth ? dayjs.unix(selectedExpenseMonth) : null
              }
            />
          }
        />
      )}
    </div>
  );
};

export default DashboardComponent;
