import React, { useState } from "react";
import { useSelector } from "react-redux";

const SkillGap = () => {
  const { user } = useSelector((store) => store.auth);
  const resumeUrl = user?.profile?.resume;

  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    setLoading(true);
    setAnalysisResult(null);

    try {
      // Simulate analysis result (replace with your API call)
      setTimeout(() => {
        setAnalysisResult({
          matchedSkills: ["JavaScript", "React"],
          missingSkills: ["Node.js", "GraphQL"],
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Error during analysis.");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Skill Gap Analysis</h1>

      <div className="flex gap-8">
        {/* Left side: Resume viewer */}
        <div className="flex-1">
          <h2 className="text-xl mb-2">Your Uploaded Resume:</h2>
          {resumeUrl ? (
            <iframe
              src={resumeUrl}
              title="Resume"
              width="100%"
              height="500px"
              style={{ border: "1px solid #ccc" }}
            >
              <p>
                Your browser does not support PDFs. Please download the file{" "}
                <a href={resumeUrl}>here</a>.
              </p>
            </iframe>
          ) : (
            <p>No resume uploaded yet.</p>
          )}
        </div>

        {/* Right side: Job description input + analyze */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="jobDescription" className="block font-semibold mb-2">
            Enter Job Description:
          </label>
          <textarea
            id="jobDescription"
            rows={15}
            className="w-full p-2 border border-gray-300 rounded mb-4 resize-none"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste or type the job description here..."
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-4 py-2 font-semibold rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          {analysisResult && (
            <div className="mt-6 p-4 border rounded bg-gray-50">
              <h3 className="text-lg font-bold mb-2">Analysis Result:</h3>
              <p>
                <strong>Matched Skills:</strong>{" "}
                {analysisResult.matchedSkills.join(", ")}
              </p>
              <p>
                <strong>Missing Skills:</strong>{" "}
                {analysisResult.missingSkills.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillGap;
