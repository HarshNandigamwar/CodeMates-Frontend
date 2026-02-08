"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  LogIn,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

export default function Navbar() {
  const pathname: string = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  // Logout
  const handleLogout = async () => {
    try {
      setLogout(true);
      await axiosInstance.post("/auth/logout");
      dispatch(logoutRedux());
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
      setLogout(false);
    } finally {
      setLogout(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    { name: "Search", href: "/search", icon: <Search size={20} /> },
    { name: "Chat", href: "/chat", icon: <MessageSquare size={20} /> },
    { name: "Create", href: "/create", icon: <PlusSquare size={20} /> },
    {
      name: "Profile",
      href: user?.username ? `/profile/${user.username}` : "#",
      icon: <User size={20} />,
    },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5">
              <Code2 size={24} className="text-accent" />
            </div>
            <span className="text-xl font-bold text-white tracking-tighter">
              Code<span className="text-accent">Mates</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 h-full">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-1 p-1 transition-all duration-200 h-full border-b-2 ${
                        isActive
                          ? "text-accent border-accent"
                          : "text-zinc-400 border-transparent hover:text-accent"
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  disabled={logout}
                  className="flex items-center gap-2 text-red-500 bg-red-500/5 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all cursor-pointer"
                >
                  {logout ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <LogOut size={20} />
                  )}
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={` flex items-center gap-2 text-accent bg-accent/5 hover:bg-accent-hover/10 px-3 py-2 rounded-lg transition-all cursor-pointer`}
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              {isOpen ? (
                <X className={`${isOpen ? "hidden" : "flex"} `} size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar/Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-full h-screen flex border-l border-zinc-800 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden shadow-2xl`}
      >
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-[40%] bg-black/10"
        ></div>

        <div className="w-[60%] p-6 flex flex-col gap-6 mt-16 bg-[#0a0a0a]">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 text-lg transition-all ${
                      isActive
                        ? "text-accent font-bold"
                        : "text-zinc-300 hover:text-accent"
                    }`}
                  >
                    <span className={isActive ? "text-accent" : ""}>
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                );
              })}
              <hr className="border-zinc-800" />
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                title="Logout"
                disabled={logout}
                className="flex items-center gap-2 text-red-500 bg-red-500/5 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all cursor-pointer"
              >
                {logout ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <LogOut size={20} />
                )}
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-accent bg-accent/5 hover:bg-accent-hover/10 px-3 py-2 rounded-lg transition-all cursor-pointer"
            >
              <LogIn size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
