import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import logo from "./image.png"; // ✅ Logo in same folder

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-10">
          <ul className="flex font-medium items-center gap-6 text-gray-700">
            {user?.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/companies" className="hover:text-[#6A38C2]">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link to="/admin/jobs" className="hover:text-[#6A38C2]">
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:text-[#6A38C2]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-[#6A38C2]">
                    Jobs
                  </Link>
                </li>
                {user?.role === "student" && (
                  <li>
                    <Link
                      to="/resume-analyzer"
                      className="hover:text-[#6A38C2]"
                    >
                      Resume Analyzer
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Login/Signup or User Dropdown */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt="profile"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="profile"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  {user.role === "student" && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User2 size={18} />
                      <Link to="/profile" className="hover:text-[#6A38C2]">
                        View Profile
                      </Link>
                    </div>
                  )}
                  <div
                    className="flex items-center gap-2 text-gray-700 cursor-pointer"
                    onClick={logoutHandler}
                  >
                    <LogOut size={18} />
                    <span className="hover:text-red-500">Logout</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
