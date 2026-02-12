"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Github,
  Linkedin,
  Globe,
  Code,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    bio: "",
    github: "",
    portfolio: "",
    linkedin: "",
    techstack: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "bio" && value.length > 120) return;
    setFormData({ ...formData, [name]: value });
  };

  const validateStep1 = () => {
    const { username, email, password, name } = formData;
    if (!username || !email || !password || !name) {
      toast.warning("Please fill all required fields");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      toast.warning("Invalid email address");
      return false;
    }
    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // Signup User
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalData = {
        ...formData,
        techstack: formData.techstack
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      };
      const res = await axiosInstance.post("/auth/signup", finalData);
      dispatch(setAuth(res.data));
      toast.success("Account created!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-10">
      <div className="w-full max-w-2xl bg-[#111111] p-6 sm:p-10 rounded-2xl border border-zinc-800 shadow-2xl">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 px-10">
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 1 ? "bg-accent" : "bg-zinc-800"
            }`}
          ></div>
          <div className="mx-4 text-accent font-bold text-sm">
            Step {step} of 2
          </div>
          <div
            className={`h-2 flex-1 rounded-full ${
              step === 2 ? "bg-accent" : "bg-zinc-800"
            }`}
          ></div>
        </div>
        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-white">
                Basic <span className="text-accent">Details</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <InputIcon
                  icon={<User size={18} />}
                  name="name"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {/* Username */}
                <InputIcon
                  icon={<User size={18} />}
                  name="username"
                  placeholder="Username *"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {/* Email */}
                <InputIcon
                  icon={<Mail size={18} />}
                  name="email"
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {/* Password*/}
                <div className="relative">
                  <InputIcon
                    icon={<Lock size={18} />}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password *"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {/* Show/hide password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-accent cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Bio*/}
              <div className="space-y-1">
                <textarea
                  name="bio"
                  placeholder="Write a short bio..."
                  className="w-full p-3 h-24 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-accent outline-none transition-all resize-none"
                  onChange={handleChange}
                  value={formData.bio}
                />
                <p className="text-right text-[10px] text-zinc-500">
                  {formData.bio.length}/150
                </p>
              </div>
              {/* Next Button */}
              <button
                type="button"
                onClick={() => validateStep1() && setStep(2)}
                className="w-full flex justify-center items-center gap-2 bg-accent hover:bg-accent-hover text-black font-bold py-3 rounded-xl transition-all"
              >
                Next Step <ArrowRight size={18} />
              </button>
              {/* Footer */}
              <p className="mt-6 text-center text-sm text-zinc-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-accent hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-500">
              <h2 className="text-2xl font-bold text-white">
                Professional <span className="text-accent">Links</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Github LInk */}
                <InputIcon
                  icon={<Github size={18} />}
                  name="github"
                  placeholder="Github URL"
                  value={formData.github}
                  onChange={handleChange}
                />
                {/* Linkedin Link */}
                <InputIcon
                  icon={<Linkedin size={18} />}
                  name="linkedin"
                  placeholder="LinkedIn URL"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
                {/* Portfolio link */}
                <InputIcon
                  icon={<Globe size={18} />}
                  name="portfolio"
                  placeholder="Portfolio URL"
                  value={formData.portfolio}
                  onChange={handleChange}
                />
                {/* TechStack */}
                <InputIcon
                  icon={<Code size={18} />}
                  name="techstack"
                  placeholder="Tech Stack (cpp, nodejs, react)"
                  value={formData.techstack}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-4">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 flex justify-center items-center gap-2 border border-zinc-700 text-white hover:bg-zinc-800 font-bold py-3 rounded-xl transition-all"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 flex justify-center items-center gap-2 bg-accent hover:bg-accent-hover text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin text-white" />
                  ) : (
                    "Complete Signup"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Reusable Input Component
function InputIcon({ icon, type = "text", ...props }: any) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
        {icon}
      </div>
      <input
        {...props}
        type={type}
        className="block w-full pl-10 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-accent transition-all sm:text-sm"
      />
    </div>
  );
}
