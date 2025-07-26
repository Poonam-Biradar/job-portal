import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      if (typeof searchedQuery === "string") {
        const searchLower = searchedQuery.toLowerCase();
        const filteredJobs = allJobs.filter((job) => {
          return (
            job.title?.toLowerCase().includes(searchLower) ||
            job.description?.toLowerCase().includes(searchLower) ||
            job.location?.toLowerCase().includes(searchLower) ||
            job.industry?.toLowerCase().includes(searchLower) ||
            job.salaryRange?.toLowerCase().includes(searchLower)
          );
        });
        setFilterJobs(filteredJobs);
      } else if (typeof searchedQuery === "object") {
        const { title, description, location, industry, salary } =
          searchedQuery;

        const filteredJobs = allJobs.filter((job) => {
          const matchTitle = title
            ? job.title?.toLowerCase().includes(title.toLowerCase())
            : true;
          const matchDescription = description
            ? job.description?.toLowerCase().includes(description.toLowerCase())
            : true;
          const matchLocation = location
            ? job.location?.toLowerCase() === location.toLowerCase()
            : true;
          const matchIndustry = industry
            ? job.industry?.toLowerCase() === industry.toLowerCase()
            : true;
          const matchSalary = salary
            ? job.salaryRange?.toLowerCase() === salary.toLowerCase()
            : true;

          return (
            matchTitle &&
            matchDescription &&
            matchLocation &&
            matchIndustry &&
            matchSalary
          );
        });

        setFilterJobs(filteredJobs);
      }
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          {/* Sidebar Filter */}
          <div className="w-1/5">
            <FilterCard />
          </div>

          {/* Job Results */}
          <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            {filterJobs.length === 0 ? (
              <div className="text-center text-gray-500 mt-10 text-lg">
                No jobs found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job?._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
