"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Code2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back, Coder!");
      router.push("/");
    } else {
      toast.error((result.payload as string) || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-[#121212] p-8 rounded-2xl shadow-2xl border border-white/5 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Code2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome to <span className="text-emerald-500">CodeMates</span>
          </h2>
          <p className="mt-2 text-gray-400">
            Sync your code, share your logic.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-500 transition-colors h-5 w-5" />
              <input
                type="email"
                required
                className="pl-11 w-full p-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-white transition-all placeholder:text-gray-600"
                placeholder="developer@codemates.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-500 transition-colors h-5 w-5" />
              <input
                type="password"
                required
                className="pl-11 w-full p-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-white transition-all placeholder:text-gray-600"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="#"
              className="text-sm text-emerald-500 hover:text-emerald-400 font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Initialize Session"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          New to the terminal?{" "}
          <Link
            href="/signup"
            className="text-emerald-500 hover:underline font-bold"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
