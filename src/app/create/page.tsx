"use client";
import { useState, useRef } from "react";
import axiosInstance from "@/lib/axios";
import { Image, Video, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/components/AuthWrapper";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // File select handle karna aur preview dikhana
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !file)
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

      toast.success("Post created successfully!");
      router.push("/"); // Redirect to home
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-[#111111] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Create <span className="text-accent">Post</span>
          </h2>

          <form onSubmit={handleCreatePost} className="space-y-4">
            {/* Text Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind, developer?"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-accent min-h-[150px] resize-none"
            />

            {/* Media Preview Area */}
            {preview && (
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black">
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-red-500 z-10"
                >
                  <X size={18} />
                </button>
                {file?.type.startsWith("video") ? (
                  <video src={preview} controls className="w-full max-h-80" />
                ) : (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full max-h-80 object-contain"
                  />
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <div className="flex gap-4">
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
                  className="flex items-center gap-2 text-zinc-400 hover:text-accent transition-colors"
                >
                  <Image size={20} />
                  <span className="text-xs hidden sm:block">Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-zinc-400 hover:text-accent transition-colors"
                >
                  <Video size={20} />
                  <span className="text-xs hidden sm:block">Video</span>
                </button>
              </div>

              <button
                disabled={loading}
                className="bg-accent hover:bg-accent-hover text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthWrapper>
  );
}
