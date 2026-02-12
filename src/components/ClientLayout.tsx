"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import axiosInstance from "@/lib/axios";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import { SocketContextProvider } from "@/context/SocketContext";

// Console Signature
if (process.env.NODE_ENV === "production") {
  const info = {
    name: "CodeMates",
    developer: "Shriharsh Nandigamwar",
    version: "1.0.0",
    tech: "Next.js 15 · Tailwind · Socket.io",
    github: "https://github.com/HarshNandigamwar",
    note: "Happy Coding! 🚀 Build something great together.",
  };

  const headerStyle = [
    "font-size: 18px",
    "font-weight: 800",
    "padding: 10px 16px",
    "border-radius: 4px",
    "color: #000",
    "background: #00ff9e",
    "text-shadow: 0 1px 1px rgba(0,0,0,0.1)",
    "font-family: monospace",
  ].join(";");

  const subStyle = [
    "font-size: 13px",
    "font-weight: 700",
    "padding: 4px 10px",
    "margin-top: 5px",
    "color: #00ff9e",
    "background: #111",
    "border: 1px solid #00ff9e",
    "border-radius: 4px",
  ].join(";");

  const labelStyle =
    "font-weight: 700; color: #ffffff; font-size: 12px; font-family: monospace;";
  const valueStyle = "color: #00ff9e; font-size: 12px; font-family: monospace;";
  const separator = "%c" + "─".repeat(45);
  const separatorStyle = "color: #27272a;";

  console.log("%c🚀 CODEMATES · DEV_CONSOLE", headerStyle);
  console.log("%c%s", subStyle, `BY ${info.developer.toUpperCase()}`);

  console.log(separator, separatorStyle);

  console.log("%c[Main Dev]  %c%s", labelStyle, valueStyle, info.developer);
  console.log("%c[Tech Stack]%c%s", labelStyle, valueStyle, info.tech);
  console.log("%c[GitHub]    %c%s", labelStyle, valueStyle, info.github);
  console.log("%c[Version]   %c%s", labelStyle, valueStyle, info.version);

  console.log(separator, separatorStyle);

  console.log(
    "%c%s",
    "font-size: 12px; color: #71717a; font-style: italic;",
    info.note
  );
}

const CheckAuth = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        dispatch(setAuth(res.data));
      } catch (err) {
        console.log("No active session found");
      }
    };
    fetchUser();
  }, [dispatch]);
  return null;
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <CheckAuth />
      <SocketContextProvider>
        <Navbar />
        <main>{children}</main>
        <Toaster theme="dark" position="top-center" richColors />
      </SocketContextProvider>
    </Providers>
  );
}
