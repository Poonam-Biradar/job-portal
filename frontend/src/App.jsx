import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@/components/ui/button";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
// import SkillGap from "./components/SkillGap"; // <-- import your new SkillGap component
import ResumeAnalyzer from "./components/ResumeAnalyzer";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  ,
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/resume-analyzer",
    element: <ResumeAnalyzer /> // Render SkillGap component on /skill-gap
  },
  // ,
  // ,
  // admin ke liye yha se start hoga
  {
    path: "/admin/companies",
    element: <Companies />,
  },
  {
    path: "/admin/companies/create",
    element: (
      // <ProtectedRoute>
      <CompanyCreate />
      // </ProtectedRoute>
    ),
  },
  ,
  {
    path: "/admin/companies/:id",
    element: (
      // <ProtectedRoute>
      <CompanySetup />
    ),
    // </ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: (
      // <ProtectedRoute>
      <AdminJobs />
    ),
    // {/* </ProtectedRoute> */}
  },
  {
    path: "/admin/jobs/create",
    element: (
      // <ProtectedRoute>
      <PostJob />
    ),
    // </ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      // <ProtectedRoute>
      <Applicants />
    ),
    // </ProtectedRoute>
  },
]);
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
