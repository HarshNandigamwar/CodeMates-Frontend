"use client";
import { useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logoutRedux } from "@/store/slices/authSlice";
import {
  Home,
  MessageSquare,
  PlusSquare,
  User,
  LogOut,
  Menu,
  X,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(logoutRedux());
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    { name: "Messages", href: "/messages", icon: <MessageSquare size={20} /> },
    { name: "Create", href: "/create", icon: <PlusSquare size={20} /> },
    {
      name: "Profile",
      href: `/profile/${user?._id}`,
      icon: <User size={20} />,
    },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-accent p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Code2 size={24} className="text-black" />
            </div>
            <span className="text-xl font-bold text-white tracking-tighter">
              Code<span className="text-accent">Mates</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-2 text-zinc-400 hover:text-accent transition-colors font-medium"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-accent hover:bg-accent-hover text-black px-6 py-2 rounded-full font-bold transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white transition-all"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar/Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-[#111111] border-l border-zinc-800 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden shadow-2xl`}
      >
        <div className="p-6 flex flex-col gap-6 mt-16">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-zinc-300 text-lg hover:text-accent"
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <hr className="border-zinc-800" />
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-4 text-red-500 text-lg"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="bg-accent text-black text-center py-3 rounded-xl font-bold"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
