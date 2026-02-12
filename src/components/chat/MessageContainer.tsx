"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Image, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export default function MessageContainer({ selectedUser }: any) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        {
          text: message,
        }
      );
      setMessages([...messages, res.data]); // Local state update
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
        <img
          src={selectedUser.profilePic}
          className="w-10 h-10 rounded-full border border-accent/20"
        />
        <div>
          <h3 className="text-white font-bold text-sm">{selectedUser.name}</h3>
          <p className="text-[10px] text-green-500">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === selectedUser._id ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                msg.sender === selectedUser._id
                  ? "bg-zinc-800 text-zinc-200 rounded-tl-none"
                  : "bg-accent text-black font-medium rounded-tr-none"
              }`}
            >
              {msg.text}
              <span className="block text-[8px] mt-1 opacity-50">12:45 PM</span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-zinc-900/30 border-t border-zinc-800 flex items-center gap-3"
      >
        <button type="button" className="text-zinc-500 hover:text-accent">
          <Image size={20} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent"
        />
        <button
          disabled={loading || !message.trim()}
          className="bg-accent p-2.5 rounded-xl text-black hover:bg-accent-hover transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}
