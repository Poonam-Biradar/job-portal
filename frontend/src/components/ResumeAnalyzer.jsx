import React, { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Navbar from "./shared/Navbar";
const ResumeAnalyzer = () => {
  const { user } = useSelector((store) => store.auth);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setError("");
    } else {
      setError("Only PDF files are allowed");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setError("");
    } else {
      setError("Only PDF files are allowed");
    }
  };

  const handleButtonClick = () => inputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setAnalysis("");

    try {
      let response;

      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("job_description", jobDescription || "");

        response = await axios.post("http://localhost:5000/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (user?.resumeUrl) {
        response = await axios.post("http://localhost:5000/analyze-url", {
          resume_url: user.resumeUrl,
          job_description: jobDescription,
        });
      } else {
        setError("Please upload a resume or make sure your profile has one.");
        setLoading(false);
        return;
      }

      setAnalysis(response.data.analysis);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatAnalysis = (rawText) => {
    const cleanedText = rawText
      .replace(/[*#_`]+/g, "") // Remove markdown symbols
      .replace(/\r?\n\s*\r?\n/g, "\n\n") // Normalize paragraph breaks
      .trim();

    const sections = cleanedText.split(/\n\n+/).map((section) => {
      const lines = section.trim().split("\n");
      const title = lines[0] || "Details";
      const content = lines.slice(1).filter((line) => line.trim() !== "");

      // Detect if content is bullet list
      const isBulletList = content.every((line) => /^[-••]/.test(line.trim()));

      return { title, content, isBulletList };
    });

    return sections;
  };

  return (
    <>
    <Navbar />

    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form
          onSubmit={handleSubmit}
          onDragEnter={handleDrag}
          className="space-y-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Resume Analyzer
          </h2>

          {user?.resumeUrl && (
            <div>
              <Label className="font-semibold">Resume on Profile</Label>
              <a
                href={user.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline block mt-1"
              >
                View Existing Resume
              </a>
            </div>
          )}

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleButtonClick}
            className={`border-2 border-dashed p-6 rounded-xl text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? "border-blue-600 bg-blue-100"
                : "border-gray-300 bg-white"
            }`}
          >
            <p className="text-gray-600 mb-1 font-medium">
              Drag & drop your resume here, or click to select
            </p>
            <p className="text-sm text-gray-400">Only PDF files allowed</p>
            <Input
              type="file"
              accept=".pdf"
              className="hidden"
              ref={inputRef}
              onChange={handleFileChange}
            />
            {resumeFile && (
              <p className="mt-3 text-green-600 font-medium">
                Selected file: {resumeFile.name}
              </p>
            )}
          </div>

          <div>
            <Label className="font-semibold">Job Description (Optional)</Label>
            <Textarea
              rows={6}
              className="mt-1"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700 w-full flex justify-center items-center py-2 text-lg rounded-xl"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Analyze Resume
          </Button>

          {error && <p className="text-red-600 font-medium mt-2">{error}</p>}
        </form>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          {analysis ? (
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Analysis Result
              </h3>
              <div className="space-y-6">
                {formatAnalysis(analysis).map((section, idx) => (
                  <div key={idx}>
                    <h4 className="text-lg font-bold text-blue-700 mb-2">
                      {section.title}
                    </h4>
                    {section.isBulletList ? (
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        {section.content.map((line, index) => (
                          <li key={index}>{line.replace(/^[-•]\s*/, "")}</li>
                        ))}
                      </ul>
                    ) : (
                      section.content.map((line, index) => (
                        <p key={index} className="text-gray-700 text-sm mb-2">
                          {line}
                        </p>
                      ))
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic min-h-[200px]">
              No analysis yet. Upload your resume and click analyze.
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ResumeAnalyzer;
