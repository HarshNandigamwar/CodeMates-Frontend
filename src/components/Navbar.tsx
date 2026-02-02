"use client";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Code2, User, LogOut, MessageSquare, PlusSquare } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all">
            <Code2 className="h-6 w-6 text-emerald-500" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">
            Code<span className="text-emerald-500">Mates</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/chat"
                className="text-gray-400 hover:text-emerald-500 p-2 transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                <PlusSquare className="h-4 w-4" /> Post
              </button>
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-500 font-bold text-xs">
                {user?.username[0].toUpperCase()}
              </div>
              <button
                onClick={() => dispatch(logout())}
                className="text-gray-500 hover:text-red-500 p-2 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-400 hover:text-white text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
