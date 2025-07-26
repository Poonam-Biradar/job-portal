import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const fitlerData = [
  {
    fitlerType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    fitlerType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "Full Stack Developer","Software Senior Engineer"],
  },
  {
    fitlerType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  return (
    <div className="w-full bg-white p-5 rounded-xl shadow-lg border border-gray-200">
      <h1 className="font-bold text-xl text-gray-800 mb-3">🎯 Filter Jobs</h1>
      <hr className="mb-4 border-gray-300" />
      {/* Grouping by filter type */}
      {fitlerData.map((data, index) => (
        <div key={index} className="mb-5">
          <h2 className="font-semibold text-md text-blue-700 mb-2">
            {data.fitlerType}
          </h2>
          <div className="space-y-2">
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              const isSelected = selectedValue === item;
              return (
                <div key={itemId} className="flex items-center gap-3">
                  <input
                    type="radio"
                    id={itemId}
                    name={data.fitlerType}
                    value={item}
                    checked={isSelected}
                    onChange={() => changeHandler(item)}
                    className="cursor-pointer border-gray-400"
                  />
                  <Label
                    htmlFor={itemId}
                    className={`cursor-pointer hover:text-blue-600 ${
                      isSelected ? "text-black font-semibold" : "text-gray-700"
                    }`}
                  >
                    {item}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
