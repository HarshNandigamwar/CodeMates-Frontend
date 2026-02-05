"use client";
import { useState } from "react";
import { Heart, MessageCircle, MoreVertical, Send } from "lucide-react";

interface PostProps {
  post: any;
}

export default function PostCard({ post }: PostProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden mb-6 transition-all">
      {/* 1. Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.user.profilePic || "https://placehold.co/100x100"}
            className="w-10 h-10 rounded-full object-cover border border-accent/20"
            alt={post.user.username}
          />
          <div>
            <p className="text-white font-semibold text-sm">{post.user.name}</p>
            <p className="text-gray-400 text-sm">{post.user.username}</p>
            <span className="text-zinc-500 text-[10px]">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        <button className="text-zinc-500 hover:text-white">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* 2. Content Text */}
      <div className="px-4 pb-3">
        <p className="text-zinc-300 text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* 3. Dynamic Media (Image or Video) */}
      {post.url && (
        <div className="w-full bg-black flex justify-center border-y border-zinc-800/50">
          {post.mediaType === "video" ? (
            <video src={post.url} controls className="w-full max-h-[500px]" />
          ) : (
            <img
              src={post.url}
              loading="lazy"
              alt="post"
              className="w-full max-h-[500px] object-contain"
            />
          )}
        </div>
      )}

      {/* 4. Action Bar */}
      <div className="p-4 flex items-center gap-6">
        <button className="flex items-center gap-2 text-zinc-400 hover:text-red-500 transition-colors">
          <Heart
            size={22}
            className={post.likes.length > 0 ? "fill-red-500 text-red-500" : ""}
          />
          <span className="text-xs font-medium">{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-zinc-400 hover:text-accent transition-colors"
        >
          <MessageCircle size={22} />
          <span className="text-xs font-medium">
            {post.comments?.length || 0}
          </span>
        </button>
      </div>

      {/* 5. Comment Section (Collapsible) */}
      {showComments && (
        <div className="border-t border-zinc-800 bg-[#0d0d0d] p-4 transition-all animate-in slide-in-from-top duration-300">
          <div className="max-h-60 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment: any) => (
                <div key={comment._id} className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[10px] text-zinc-400">
                    U
                  </div>
                  <div className="bg-zinc-900 rounded-2xl px-4 py-2 flex-1">
                    <p className="text-zinc-200 text-xs leading-normal">
                      {comment.text}
                    </p>
                    <span className="text-[9px] text-zinc-500 mt-1 block">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-600 text-xs text-center py-2">
                No comments yet.
              </p>
            )}
          </div>

          {/* Add Comment Input */}
          <div className="flex items-center gap-2 border-t border-zinc-800 pt-3">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-accent"
            />
            <button className="text-accent hover:scale-110 transition-transform">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
