"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useSocketContext } from "@/context/SocketContext";
import Link from "next/link";
import ChatSidebarLoader from "@/components/SkeletonLoders/ChatSidebarLoader";
import { useParams } from "next/navigation";

export default function Sidebar() {
  const [users, setUsers] = useState<any[]>([]);
  const { onlineUsers, socket } = useSocketContext();
  const [loading, setLoading] = useState(false);
  const [unreadUsers, setUnreadUsers] = useState<string[]>([]);
  const params = useParams();
  const currentChatId = params?.id;

  // Fetch Users
  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/auth/suggested");
        setUsers(res.data);
      } catch (err) {
        console.error("Sidebar Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  // Real-time Re-ordering & Unread Indicator
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      const senderId = newMessage.sender;

      // Agar user us chat par nahi baitha hai, tabhi green dot dikhao
      if (currentChatId !== senderId) {
        setUnreadUsers((prev) => Array.from(new Set([...prev, senderId])));
      }

      // User ko list mein top par laane ke liye state update karein
      setUsers((prevUsers) => {
        const userIdx = prevUsers.findIndex((u) => u._id === senderId);
        if (userIdx === -1) return prevUsers;
        const updatedUsers = [...prevUsers];
        const [targetUser] = updatedUsers.splice(userIdx, 1);
        return [targetUser, ...updatedUsers]; // Top par move karna user ko
      });
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, currentChatId]);

  // Current Chat open karte hi unread status hatayein
  useEffect(() => {
    if (currentChatId) {
      setUnreadUsers((prev) => prev.filter((id) => id !== currentChatId));
    }
  }, [currentChatId]);

  return (
    <div className="md:w-80 border-r border-zinc-800 h-full overflow-y-auto bg-[#0a0a0a]">
      {loading ? (
        <ChatSidebarLoader />
      ) : (
        <div className="flex flex-col">
          {users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const hasUnread = unreadUsers.includes(user._id);
            return (
              <Link
                key={user._id}
                href={`/chat/${user._id}`}
                className={`flex items-center gap-3 p-4 hover:bg-zinc-900 transition-colors border-b border-zinc-900/50 ${
                  currentChatId === user._id ? "bg-zinc-900" : ""
                }`}
              >
                {/* User Image */}
                <div className="relative">
                  <img
                    src={
                      user.profilePic ||
                      "https://res.cloudinary.com/darmatnf2/image/upload/v1772109026/user_pic_taeqah.png"
                    }
                    alt={user.name}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-black rounded-full ${
                      isOnline ? "bg-green-500" : "bg-red-600"
                    }`}
                  />
                </div>
                {/* Name and Username */}
                <div className="flex-1">
                  {/* User name */}
                  <p className="text-white font-medium text-sm">{user.name}</p>
                  {/* User Username */}
                  <p className="text-zinc-500 text-xs truncate">
                    {user.username}
                  </p>
                </div>
                {/* Unread Message */}
                <span>
                  {hasUnread && (
                    <div
                      title="Unread Message"
                      className="w-4 h-4 bg-accent rounded-full"
                    />
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
