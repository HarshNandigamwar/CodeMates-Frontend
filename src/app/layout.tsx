"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import axiosInstance from "@/lib/axios";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <CheckAuth />
          <Navbar />
          <main >{children}</main>
          <Toaster theme="dark" richColors />
        </Providers>
      </body>
    </html>
  );
}
