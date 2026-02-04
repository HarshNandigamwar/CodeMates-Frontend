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
  Check,
} from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState(1);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      dispatch(setAuth(res.data));
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
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

        <form onSubmit={handleSignup} className="space-y-6">
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-white">
                Basic <span className="text-accent">Details</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputIcon
                  icon={<User size={18} />}
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <InputIcon
                  icon={<User size={18} />}
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <InputIcon
                  icon={<Mail size={18} />}
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <InputIcon
                  icon={<Lock size={18} />}
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <textarea
                name="bio"
                placeholder="Write a short bio..."
                className="w-full p-3 h-24 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-accent outline-none transition-all"
                onChange={handleChange}
                value={formData.bio}
              />
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full flex justify-center items-center gap-2 bg-accent hover:bg-accent-hover text-black font-bold py-3 rounded-xl transition-all"
              >
                Next Step <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: Professional & Tech Info */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-500">
              <h2 className="text-2xl font-bold text-white">
                Professional <span className="text-accent">Links</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputIcon
                  icon={<Github size={18} />}
                  name="github"
                  placeholder="Github URL"
                  value={formData.github}
                  onChange={handleChange}
                />
                <InputIcon
                  icon={<Linkedin size={18} />}
                  name="linkedin"
                  placeholder="LinkedIn URL"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
                <InputIcon
                  icon={<Globe size={18} />}
                  name="portfolio"
                  placeholder="Portfolio URL"
                  value={formData.portfolio}
                  onChange={handleChange}
                />
                <InputIcon
                  icon={<Code size={18} />}
                  name="techstack"
                  placeholder="Tech Stack (cpp, nodejs, etc.)"
                  value={formData.techstack}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 flex justify-center items-center gap-2 border border-zinc-700 text-white hover:bg-zinc-800 font-bold py-3 rounded-xl transition-all"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] flex justify-center items-center gap-2 bg-accent hover:bg-accent-hover text-black font-bold py-3 rounded-xl transition-all"
                >
                  {loading ? "Creating Account..." : "Complete Signup"}{" "}
                  <Check size={18} />
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Already a member?{" "}
          <Link
            href="/login"
            className="text-accent font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

// Reusable Input Component for clean code
function InputIcon({ icon, ...props }: any) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
        {icon}
      </div>
      <input
        {...props}
        className="block w-full pl-10 pr-3 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent transition-all sm:text-sm"
      />
    </div>
  );
}
