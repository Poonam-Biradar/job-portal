import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

// FloatingInput Component
const FloatingInput = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  accept,
  file,
  onFileChange,
  label,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full">
      {type !== "file" ? (
        <>
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-base text-gray-900 placeholder-transparent focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700"
            placeholder={label}
            autoComplete="off"
          />
          <label
            htmlFor={id}
            className={`absolute left-3 top-2 z-10 origin-[0] scale-75 transform text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:scale-75 peer-focus:text-purple-700`}
          >
            {label}
          </label>
        </>
      ) : (
        <>
          <input
            id={id}
            name={name}
            type="file"
            accept={accept}
            onChange={onFileChange}
            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 file:cursor-pointer file:border-0 file:bg-purple-700 file:px-3 file:py-1 file:text-white file:rounded file:hover:bg-purple-800 focus:outline-none focus:ring-1 focus:ring-purple-700"
          />
          {file && typeof file === "object" && (
            <p className="mt-1 text-sm text-gray-600">Selected: {file.name}</p>
          )}
        </>
      )}
    </div>
  );
};

// Main Dialog Component
const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: null,
  });

  // Reset input when dialog opens
  useEffect(() => {
    if (open) {
      setInput({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        file: null,
      });
    }
  }, [open, user]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-lg w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-center"
        style={{ top: "50%", transform: "translateY(-50%)" }} // Centered vertically
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-purple-700 text-center mb-4">
            Update Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-5">
          <FloatingInput
            id="fullname"
            name="fullname"
            label="Full Name"
            value={input.fullname}
            onChange={changeEventHandler}
          />
          <FloatingInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={input.email}
            onChange={changeEventHandler}
          />
          <FloatingInput
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            value={input.phoneNumber}
            onChange={changeEventHandler}
          />
          <FloatingInput
            id="bio"
            name="bio"
            label="Bio"
            value={input.bio}
            onChange={changeEventHandler}
          />
          <FloatingInput
            id="skills"
            name="skills"
            label="Skills (comma separated)"
            value={input.skills}
            onChange={changeEventHandler}
          />
          <FloatingInput
            id="file"
            name="file"
            type="file"
            accept="application/pdf"
            onFileChange={fileChangeHandler}
            label="Upload Resume (PDF)"
            file={input.file}
          />

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white text-lg py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
