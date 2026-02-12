"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useSocketContext } from "@/context/SocketContext";
import Link from "next/link";

export default function Sidebar() {
  const [users, setUsers] = useState<any[]>([]);
  const { onlineUsers } = useSocketContext();

  //   Fetch Users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axiosInstance.get("/auth/suggested");
        setUsers(res.data);
      } catch (err) {
        console.error("Sidebar Fetch Error:", err);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="w-80 border-r border-zinc-800 h-full overflow-y-auto bg-[#0a0a0a]">
      <div className="p-4 border-b border-zinc-800 ">
        <h2 className="text-xl font-bold text-white">Chats</h2>
      </div>

      <div className="flex flex-col">
        {users.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          return (
            <Link
              key={user._id}
              href={`/chat/${user._id}`}
              className="flex items-center gap-3 p-4 hover:bg-zinc-900 transition-colors border-b border-zinc-900/50"
            >
              {/* User Image */}
              <div className="relative">
                <img
                  src={user.profilePic}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover"
                />
                {isOnline ? (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                ) : (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 border-2 border-black rounded-full" />
                )}
              </div>
              <div className="flex-1">
                {/* User name */}
                <p className="text-white font-medium text-sm">{user.name}</p>
                {/* User Username */}
                <p className="text-zinc-500 text-xs truncate">
                  {user.username}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
