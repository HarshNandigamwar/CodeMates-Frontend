"use client";
import { useEffect, useState, useRef, use } from "react";
import { useSocketContext } from "@/context/SocketContext";
import axiosInstance from "@/lib/axios";
import { Send, Loader2, MessageSquareQuote } from "lucide-react";
import MessageSkeleton from "@/components/SkeletonLoders/MessageSkeleton";

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
  const [initialLoading, setInitialLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch old Message
  useEffect(() => {
    const fetchMessages = async () => {
      setInitialLoading(true);
      try {
        const res = await axiosInstance.get(`/messages/${receiverId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    if (receiverId) fetchMessages();
  }, [receiverId]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage: any) => {
      if (newMessage.sender === receiverId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage");
  }, [socket, receiverId]);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[90vh] bg-[#0a0a0a] text-white">
      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {initialLoading ? (
          <div className="mt-10">
            <MessageSkeleton />
          </div>
        ) : messages.length === 0 ? (
          //Empty message
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-80">
            <div className="bg-zinc-900 p-6 rounded-full ring-1 ring-zinc-800">
              <MessageSquareQuote size={48} className="text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Say Hello!</h3>
              <p className="text-sm text-zinc-500 max-w-[200px] mt-1">
                No messages yet. Send a wave to start the conversation.
              </p>
            </div>
          </div>
        ) : (
          messages.map((m) => {
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
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-zinc-900 flex gap-2 bg-[#0a0a0a]"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-xl outline-none focus:border-accent transition-all text-sm"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="bg-accent p-3 rounded-xl text-black hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100"
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
