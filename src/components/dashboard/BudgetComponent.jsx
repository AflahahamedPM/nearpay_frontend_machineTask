import React, { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useDashboardData } from "../../providers/DashboardProvider";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const BudgetComponent = () => {
  const {
    handleMonthChange,
    selectedMonth,
    budgetData,
    setBudgetData,
    handleBudgetChange,
    handleBudgetSave,
  } = useDashboardData();

  return (
    <>
      <div className=" sm:w-1/2 mx-auto w-11/12 mt-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="sm:text-2xl  font-bold text-gray-700">
            Monthly Budget
          </h2>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Month"
              views={["month", "year"]}
              value={selectedMonth}
              maxDate={dayjs()}
              onChange={handleMonthChange}
            />
          </LocalizationProvider>
        </div>

        {budgetData?.length === 0 ? (
          <p className="sm:text-2xl text-xl font-bold flex justify-center items-center">
            No Budgets for the selected Month
          </p>
        ) : (
          budgetData?.map((data) => (
            <div
              key={data?._id}
              className={`p-3 border border-gray-400 rounded-xl flex justify-between items-center mb-3`}
            >
              <div className="flex gap-3 justify-center items-center">
                <div
                  className="rounded-full h-6 w-6"
                  style={{ backgroundColor: data?.categoryDetails?.color }}
                />
                <p className="text-lg font-semibold">
                  {data?.categoryDetails?.name}
                </p>
              </div>

              <Input
                value={data?.maxBudget}
                className="sm:w-1/6 w-1/3"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleBudgetChange(data?._id, value);
                  }
                }}
              />
            </div>
          ))
        )}
        {budgetData?.length > 0 && (
          <Button
            onClick={handleBudgetSave}
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:text-white  w-full"
          >
            Save
          </Button>
        )}
      </div>
    </>
  );
};

export default BudgetComponent;
