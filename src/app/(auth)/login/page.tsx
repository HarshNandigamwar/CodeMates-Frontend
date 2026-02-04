"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { LogIn, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      dispatch(setAuth(res.data)); 
      toast.success("Welcome back to CodeMates!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 sm:px-6 lg:px-8">
      {/* Main Container: Mobile me full width, Tablet/PC me limited width */}
      <div className="w-full max-w-md space-y-8 bg-[#111111] p-6 sm:p-10 rounded-2xl border border-zinc-800 shadow-2xl">
        
        {/* Logo & Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <LogIn className="h-6 w-6 text-accent" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
            Login to <span className="text-accent">CodeMates</span>
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all sm:text-sm"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all sm:text-sm"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Remember & Forgot Password (Desktop me Row, Mobile me Column) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-accent focus:ring-accent" />
              <label className="ml-2 block text-sm text-zinc-400">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-accent hover:text-accent-hover">Forgot password?</a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-accent hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
