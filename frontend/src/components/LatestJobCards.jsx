import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const [readMore, setReadMore] = useState(false);

  const toggleReadMore = (e) => {
    e.stopPropagation();
    setReadMore((prev) => !prev);
  };

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-xl shadow-sm hover:shadow-lg hover:border-[#6A38C2] bg-white border border-gray-200 cursor-pointer transition-all duration-300 ease-in-out"
    >
      {/* Top Section: Logo & Company */}
      <div className="flex items-center gap-4 mb-3">
        {job?.company?.logo && (
          <img
            src={job.company.logo}
            alt={`${job.company.name} logo`}
            className="w-12 h-12 object-contain rounded-full border"
          />
        )}
        <div>
          <h1 className="font-semibold text-gray-800 text-md">
            {job?.company?.name}
          </h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      {/* Job Title */}
      <h2 className="text-lg font-bold text-[#6A38C2] mt-2">{job?.title}</h2>

      {/* Description with Read More */}
      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
        {readMore
          ? job?.description
          : job?.description?.slice(0, 150) +
            (job?.description?.length > 150 ? "..." : "")}
        {job?.description?.length > 150 && (
          <span
            onClick={toggleReadMore}
            className="text-blue-600 ml-1 hover:underline cursor-pointer"
          >
            {readMore ? "Read Less" : "Read More"}
          </span>
        )}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Badge className="bg-blue-100 text-blue-700 font-medium">
          {job?.position} Positions
        </Badge>
        <Badge className="bg-red-100 text-red-700 font-medium">
          {job?.jobType}
        </Badge>
        <Badge className="bg-purple-100 text-purple-700 font-medium">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
