"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axiosInstance from "@/lib/axios";
import { useSelector } from "react-redux";
import { Send, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ChatPage({ params }: { params: { id: string } }) {
  const receiverId = params.id;
  const { user: currentUser } = useSelector((state: any) => state.auth);

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Socket Setup & Listen
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      query: { userId: currentUser?._id },
    });

    setSocket(newSocket);

    newSocket.on("newMessage", (newMessage: any) => {
      // Check karein ki message usi user se aaya hai jisse hum chat kar rahe hain
      if (newMessage.sender === receiverId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [receiverId, currentUser?._id]);

  // 2. Fetch Old Messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/messages/${receiverId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages");
      }
    };
    fetchMessages();
  }, [receiverId]);

  // 3. Scroll to Bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post(`/messages/send/${receiverId}`, {
        text,
      });
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (error) {
      toast.error("Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] pt-20 px-4 max-w-4xl mx-auto">
      <div className="flex-1 bg-[#111111] border border-zinc-800 rounded-t-2xl overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => {
          const isMe = msg.sender === currentUser?._id;
          return (
            <div
              key={idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                  isMe
                    ? "bg-accent text-black font-medium rounded-tr-none"
                    : "bg-zinc-800 text-zinc-200 rounded-tl-none"
                }`}
              >
                {msg.text}
                {msg.fileUrl && (
                  <img
                    src={msg.fileUrl}
                    className="mt-2 rounded-lg max-h-60 w-full object-cover"
                  />
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-[#111111] border-x border-b border-zinc-800 rounded-b-2xl flex gap-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
        />
        <button
          disabled={loading}
          className="bg-accent text-black p-3 rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}
