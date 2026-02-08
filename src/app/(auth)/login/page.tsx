"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { LogIn, Mail, Lock, Code2, Loader, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // Login user
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      dispatch(setAuth(res.data));
      toast.success("Welcome back to CodeMates!");
      router.push("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-[#111111] p-6 sm:p-10 rounded-2xl border border-zinc-800 shadow-2xl">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Code2 className="h-6 w-6 text-accent" />
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
                type={showPassword ? "text" : "password"} // Dynamic type
                required
                className="block w-full pl-10 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all sm:text-sm"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Show/Hide Toggle Button */}
              <button
                type="button" // Ye zaroori hai taaki form submit na ho jaye
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-accent transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all active:scale-95 disabled:opacity-50 cursor-pointer items-center"
          >
            {loading ? (
              <Loader className="animate-spin text-white" />
            ) : (
              "Sign In"
            )}
          </button>
          {/* Login with Google */}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-amber-50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer gap-2 items-center"
          >
            <LogIn />
            Continue with Google
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-accent hover:underline"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
