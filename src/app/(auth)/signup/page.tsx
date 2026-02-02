"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signupUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Loader2,
  Code2,
  User,
  AtSign,
  Github,
  Globe,
  Linkedin,
  Terminal,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState(1); // Step tracker
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

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.auth);

  const nextStep = () => {
    if (
      step === 1 &&
      (!formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.name)
    ) {
      return toast.error("Please fill all required credentials");
    }
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(signupUser(formData));

    if (signupUser.fulfilled.match(result)) {
      toast.success("Deployment Successful! Welcome.");
      router.push("/");
    } else {
      toast.error((result.payload as string) || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-10 relative">
      {/* Glow effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full" />

      <div className="max-w-md w-full space-y-8 bg-[#121212] p-8 rounded-2xl shadow-2xl border border-white/5 relative z-10">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8">
          <div
            className={`h-1 w-full rounded-full ${
              step >= 1 ? "bg-emerald-500" : "bg-gray-800"
            } transition-all`}
          />
          <div className="mx-2 text-xs font-mono text-gray-500">
            STEP_0{step}
          </div>
          <div
            className={`h-1 w-full rounded-full ${
              step === 2 ? "bg-emerald-500" : "bg-gray-800"
            } transition-all`}
          />
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Code2 className="h-6 w-6 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {step === 1 ? "Initialize Profile" : "Developer Config"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {step === 1
              ? "Start by setting up your basic credentials."
              : "Tell us more about your stack."}
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {step === 1 ? (
            /* PAGE 1: CREDENTIALS */
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="relative group">
                <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-500 h-5 w-5 transition-colors" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  className="pl-11 w-full p-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl focus:border-emerald-500 outline-none text-white transition-all"
                  placeholder="Full Name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="relative group">
                <AtSign className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-500 h-5 w-5 transition-colors" />
                <input
                  type="text"
                  required
                  value={formData.username}
                  className="pl-11 w-full p-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl focus:border-emerald-500 outline-none text-white transition-all"
                  placeholder="username"
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-500 h-5 w-5 transition-colors" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  className="pl-11 w-full p-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl focus:border-emerald-500 outline-none text-white transition-all"
                  placeholder="email@codemates.com"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-500 h-5 w-5 transition-colors" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  className="pl-11 w-full p-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl focus:border-emerald-500 outline-none text-white transition-all"
                  placeholder="password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all mt-6"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* PAGE 2: DEVELOPER INFO */
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="relative group">
                <Github className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-500 h-5 w-5 transition-colors" />
                <input
                  type="text"
                  className="pl-11 w-full p-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl focus:border-emerald-500 outline-none text-white transition-all"
                  placeholder="GitHub URL"
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                />
              </div>
              <div className="relative group">
                <Terminal className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-500 h-5 w-5 transition-colors" />
                <input
                  type="text"
                  className="pl-11 w-full p-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl focus:border-emerald-500 outline-none text-white transition-all"
                  placeholder="Stack (e.g. MERN, Python)"
                  onChange={(e) =>
                    setFormData({ ...formData, techstack: e.target.value })
                  }
                />
              </div>
              <textarea
                className="w-full p-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl focus:border-emerald-500 outline-none text-white transition-all h-24 resize-none"
                placeholder="Short bio about yourself..."
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 bg-white/5 hover:bg-white/10 text-white p-3.5 rounded-xl font-bold border border-white/10 transition-all flex justify-center items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Deploy Account"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already verified?{" "}
          <Link href="/login" className="text-emerald-500 hover:underline">
            Access Terminal
          </Link>
        </p>
      </div>
    </div>
  );
}
