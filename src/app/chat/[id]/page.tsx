"use client";
import { useEffect, useState, useRef, use } from "react";
import { useSocketContext } from "@/context/SocketContext";
import axiosInstance from "@/lib/axios";
import { Send, Loader2 } from "lucide-react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const receiverId = resolvedParams.id;
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  //Fetch old message
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/messages/${receiverId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (receiverId) fetchMessages();
  }, [receiverId]);

  // Real-time Message Listen karna
  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (newMessage: any) => {
      if (newMessage.sender === receiverId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    return () => socket.off("newMessage");
  }, [socket, receiverId]);

  // Message Send karna
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/messages/send/${receiverId}`, {
        text,
      });
      setMessages((prev) => [...prev, res.data]); // Local state update
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[90vh] bg-[#0a0a0a] text-white">
      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isMessageFromMe = m.sender !== receiverId;
          return (
            <div
              key={m._id}
              className={`flex ${
                isMessageFromMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 px-4 rounded-2xl max-w-[75%] text-sm shadow-sm ${
                  isMessageFromMe
                    ? "bg-accent text-black font-medium rounded-tr-none"
                    : "bg-zinc-800 text-zinc-200 rounded-tl-none"
                }`}
              >
                {m.text}
                <span
                  className={`block text-[9px] mt-1 opacity-50 ${
                    isMessageFromMe ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-zinc-900 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
          className="flex-1 bg-black border border-zinc-700 p-2 rounded-lg outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent p-2 rounded-lg text-black"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
        </button>
      </form>
    </div>
  );
}
