"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { MessageSquare, User as UserIcon } from "lucide-react";

export default function ChatLayout() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Aap yahan wo users fetch kar sakte hain jinhe user follow karta hai
        const res = await axiosInstance.get("/users/suggested"); // Ya fir connections API
        setContacts(res.data);
      } catch (error) {
        console.error("Error fetching contacts");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0a] pt-20 px-4 gap-4 max-w-7xl mx-auto">
      {/* Sidebar - Contacts List */}
      <div className="w-full md:w-80 bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/20">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare size={20} className="text-accent" />
            Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {loading ? (
            <div className="p-4 text-zinc-500 text-sm italic">
              Loading contacts...
            </div>
          ) : (
            contacts.map((contact) => (
              <Link
                key={contact._id}
                href={`/chat/${contact._id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800 group"
              >
                <div className="relative">
                  <img
                    src={contact.profilePic || "https://placehold.co/100x100"}
                    className="w-12 h-12 rounded-full object-cover border border-zinc-800 group-hover:border-accent/50"
                  />
                  {/* Online Status Dot - Agar aapka socket online handle karta hai */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#111111] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200 truncate">
                    {contact.name}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    @{contact.username}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Placeholder for when no chat is selected */}
      <div className="hidden md:flex flex-1 bg-[#111111] border border-zinc-800 rounded-2xl items-center justify-center text-center p-10">
        <div className="space-y-4">
          <div className="bg-zinc-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-zinc-800">
            <MessageSquare size={40} className="text-zinc-700" />
          </div>
          <h3 className="text-xl font-bold text-white">Your Messages</h3>
          <p className="text-zinc-500 text-sm max-w-xs">
            Select a contact from the left to start a real-time conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
