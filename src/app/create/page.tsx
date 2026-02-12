"use client";
import { useState, useRef } from "react";
import axiosInstance from "@/lib/axios";
import { Image, Video, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/components/AuthWrapper";
import { useSelector } from "react-redux";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const MAX_CHAR = 120;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        return toast.error("File size should be less than 50MB");
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Create Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file)
      return toast.error("Please add some content or media");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (file) {
        formData.append("url", file);
      }
      await axiosInstance.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post shared with the community!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
      console.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-xl bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-zinc-700">
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              New <span className="text-accent">Post</span>
            </h2>
            <div className="flex items-center gap-2">
              <div
                className={`text-[10px] font-mono px-2 py-1 rounded-md ${
                  content.length >= MAX_CHAR
                    ? "bg-red-500/10 text-red-500"
                    : "bg-accent/10 text-accent"
                }`}
              >
                {content.length} / {MAX_CHAR}
              </div>
            </div>
          </div>

          <form onSubmit={handleCreatePost} className="p-6 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-2">
              <img
                src={user?.profilePic || "https://placehold.co/100x100"}
                loading="lazy"
                className="w-10 h-10 rounded-full border border-zinc-800 object-cover"
                alt="profile"
              />
              <span className="text-sm font-semibold text-zinc-300">
                {user?.username}
              </span>
            </div>

            {/* Text Input */}
            <textarea
              value={content}
              onChange={(e) =>
                e.target.value.length <= MAX_CHAR && setContent(e.target.value)
              }
              placeholder="What's your latest tech breakthrough?"
              className="w-full bg-transparent text-white text-lg placeholder:text-zinc-600 focus:outline-none min-h-[120px] resize-none leading-relaxed"
            />

            {/* Media Preview Area */}
            {preview && (
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-black/70 text-white rounded-full hover:bg-red-500 transition-colors z-20 backdrop-blur-md"
                >
                  <X size={16} />
                </button>
                {file?.type.startsWith("video") ? (
                  <video
                    src={preview}
                    controls
                    className="w-full max-h-[400px]"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full max-h-[400px] object-cover"
                  />
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
              <div className="flex gap-2">
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 bg-zinc-900 text-zinc-400 hover:text-accent hover:bg-zinc-800 rounded-xl transition-all group cursor-pointer"
                  title="Add Image"
                >
                  <Image
                    size={22}
                    className="group-hover:scale-110 transition-transform"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 bg-zinc-900 text-zinc-400 hover:text-accent hover:bg-zinc-800 rounded-xl transition-all group cursor-pointer"
                  title="Add Video"
                >
                  <Video
                    size={22}
                    className="group-hover:scale-110 transition-transform"
                  />
                </button>
              </div>
              {/* Post Button */}
              <button
                disabled={loading || (!content.trim() && !file)}
                className="bg-accent hover:bg-accent-hover text-black px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale transition-all active:scale-95 shadow-lg shadow-accent/10 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Publish</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthWrapper>
  );
}
