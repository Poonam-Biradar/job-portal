import React, { useEffect, useState } from "react"; 
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isInitiallyApplied = singleJob?.applications?.some(
    (app) => app.applicant === user?._id
  ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    resumeFile: null,
    existingResumeUrl: user?.resume || "",
  });

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  // Reset form data on modal open
  useEffect(() => {
    if (showModal) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        resumeFile: null,
        existingResumeUrl: user?.resume || "",
      });
    }
  }, [showModal, user]);

  // Fetch single job details
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (app) => app.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch job details.");
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, resumeFile: file || null }));
  };

  const applyJobHandler = async () => {
    if (!formData.resumeFile && !formData.existingResumeUrl) {
      toast.error("Please upload a resume before applying.");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      if (formData.resumeFile) {
        data.append("resume", formData.resumeFile);
      } else if (formData.existingResumeUrl) {
        data.append("resumeUrl", formData.existingResumeUrl);
      }

      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setIsApplied(true);
        dispatch(setSingleJob({
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        }));
        toast.success(res.data.message);
        setShowModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-12 p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{singleJob?.title}</h1>
            <div className="flex flex-wrap gap-3 mt-3">
              <Badge variant="ghost" className="text-blue-700 font-semibold">
                {singleJob?.position} Positions
              </Badge>
              <Badge variant="ghost" className="text-red-600 font-semibold">
                {singleJob?.jobType}
              </Badge>
              <Badge variant="ghost" className="text-purple-700 font-semibold">
                {singleJob?.salary} LPA
              </Badge>
            </div>
          </div>

          <Button
            onClick={isApplied ? undefined : () => setShowModal(true)}
            disabled={isApplied}
            className={`rounded-lg px-6 py-2 text-white font-semibold transition ${
              isApplied
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>

        <section className="mt-10 space-y-5 border-t border-gray-300 pt-6">
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-2">Job Description</h2>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            <div>
              <dt className="font-semibold">Role</dt>
              <dd>{singleJob?.title}</dd>
            </div>
            <div>
              <dt className="font-semibold">Location</dt>
              <dd>{singleJob?.location}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-semibold">Description</dt>
              <dd>{singleJob?.description}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-semibold">Requirements</dt>
              <dd>{singleJob?.requirements}</dd>
            </div>
            <div>
              <dt className="font-semibold">Experience</dt>
              <dd>{singleJob?.experience} years</dd>
            </div>
            <div>
              <dt className="font-semibold">Salary</dt>
              <dd>{singleJob?.salary} LPA</dd>
            </div>
            <div>
              <dt className="font-semibold">Total Applicants</dt>
              <dd>{singleJob?.applications?.length || 0}</dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-purple-700 mb-5 text-center">
              Confirm Application
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyJobHandler();
              }}
              className="space-y-5"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold mb-1">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-semibold mb-1">
                  Upload Resume
                </label>

                {formData.existingResumeUrl && !formData.resumeFile && (
                  <p className="mb-2 text-sm text-blue-700 underline">
                    Current Resume:{" "}
                    <a
                      href={formData.existingResumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-600"
                    >
                      View
                    </a>
                  </p>
                )}

                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full"
                />

                {!formData.resumeFile && !formData.existingResumeUrl && (
                  <p className="text-red-600 mt-1 text-sm">No resume uploaded</p>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.resumeFile && !formData.existingResumeUrl}
                  className={`${
                    formData.resumeFile || formData.existingResumeUrl
                      ? "bg-purple-700 hover:bg-purple-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Confirm & Apply
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JobDescription;
