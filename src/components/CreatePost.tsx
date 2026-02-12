"use client";
import { useState } from "react";
import { Image, Send, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return toast.error("Write something first!");

    setIsPosting(true);
    try {
      await axiosInstance.post("/posts", { content });
      toast.success("Code Deployed to Feed!");
      setContent("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Post failed");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 shadow-xl">
      <div className="flex gap-4">
        <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-500">
          U
        </div>
        <textarea
          className="w-full bg-transparent border-none outline-none text-white resize-none placeholder:text-gray-600 mt-2 min-h-[80px]"
          placeholder="What's your latest build?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
        <button className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors text-sm font-medium">
          <Image size={18} /> Add Image
        </button>
        <button
          onClick={handlePost}
          disabled={isPosting || !content.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
        >
          {isPosting ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <>
              <Send size={14} /> Post
            </>
          )}
        </button>
      </div>
    </div>
  );
}
