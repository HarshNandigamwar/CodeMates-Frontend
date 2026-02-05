"use client";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  Loader2,
  Trash2,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface PostProps {
  post: any;
}

export default function PostCard({ post: initialPost }: PostProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [currentPost, setCurrentPost] = useState(initialPost);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isOwner = currentUser?._id === currentPost.user._id;

  // Add like on post
  const isLiked = currentPost.likes.includes(user?._id);
  const handleLike = async () => {
    if (!user) return toast.error("Please login to like");
    try {
      const res = await axiosInstance.put(`/posts/like/${currentPost._id}`);
      setCurrentPost(res.data);
    } catch (error: any) {
      toast.error("Error updating like");
      console.error(error);
    }
  };
  // Add Comment on post
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await axiosInstance.post(
        `/posts/comment/${currentPost._id}`,
        {
          text: commentText,
        }
      );
      setCurrentPost(res.data);
      setCommentText("");
      toast.success("Comment added!");
    } catch (error: any) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setCommentLoading(false);
    }
  };
  // Delete Post
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axiosInstance.delete(`/posts/${currentPost._id}`);
      toast.success("Post deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden mb-6 transition-all">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {/* ProfilePic And name */}
        <div className="flex items-center gap-3">
          <img
            src={currentPost.user.profilePic || "https://placehold.co/100x100"}
            className="w-10 h-10 rounded-full object-cover border border-accent/20"
            alt={currentPost.user.username}
          />
          <div>
            <p className="text-white font-semibold text-sm">
              {currentPost.user.name}
            </p>
            <p className="text-gray-400 text-xs">{currentPost.user.username}</p>
            <span className="text-zinc-500 text-[10px]">
              {new Date(currentPost.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        {/* Edit & Delete Post */}
        <div className="relative group ">
          <button className="text-zinc-500 hover:text-white p-2">
            <MoreVertical size={18} />
          </button>
          {/* Dropdown Menu */}
          {isOwner && (
            <div className="absolute right-0 mt-2 w-32 bg-[#18181b] border border-zinc-800 rounded-lg shadow-xl hidden group-hover:block z-50">
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Content Text */}
      <div className="px-4 pb-3">
        <p className="text-zinc-300 text-sm leading-relaxed">
          {currentPost.content}
        </p>
      </div>
      {/* Dynamic Media */}
      {currentPost.url && (
        <div className="w-full bg-black flex justify-center border-y border-zinc-800/50">
          {currentPost.mediaType === "video" ? (
            <video
              src={currentPost.url}
              controls
              className="w-full max-h-[500px]"
            />
          ) : (
            <img
              src={currentPost.url}
              loading="lazy"
              alt="post"
              className="w-full max-h-[500px] object-contain"
            />
          )}
        </div>
      )}
      {/* Action Bar */}
      <div className="p-4 flex items-center gap-6">
        {/* like button */}
        <button
          onClick={handleLike}
          className="flex items-center gap-2 transition-all active:scale-125 cursor-pointer"
        >
          <Heart
            size={22}
            className={`transition-colors ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-zinc-400 hover:text-red-400"
            }`}
          />
          <span
            className={`text-xs font-medium ${
              isLiked ? "text-red-500" : "text-zinc-400"
            }`}
          >
            {currentPost.likes?.length || 0}
          </span>
        </button>
        {/* Comment button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-zinc-400 hover:text-accent transition-colors cursor-pointer cursor-pointer"
        >
          <MessageCircle size={22} />
          <span className="text-xs font-medium">
            {currentPost.comments?.length || 0}
          </span>
        </button>
      </div>
      {/* Comment Section */}
      {showComments && (
        <div className="border-t border-zinc-800 bg-[#0d0d0d] p-4 animate-in slide-in-from-top duration-300">
          <div className="max-h-60 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
            {currentPost.comments && currentPost.comments.length > 0 ? (
              currentPost.comments.map((comment: any) => (
                <div key={comment._id} className="flex gap-3 items-start">
                  <img
                    src={comment.profilePic || "https://placehold.co/100x100"}
                    loading="lazy"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="bg-zinc-900 rounded-2xl px-4 py-2 flex-1">
                    <p className="text-[11px] font-bold text-accent mb-0.5">
                      {comment.name || "user"}
                    </p>
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
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="p-3 bg-zinc-900/50 rounded-full mb-3">
                  <MessageCircle size={24} className="text-zinc-600" />
                </div>
                <p className="text-xs text-zinc-500 italic">No comments yet.</p>
                <p className="text-[10px] text-zinc-600 mt-1 text-accent/80 font-medium">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>

          {/* Add Comment Input */}
          <div className="flex w-full border-t border-zinc-800 pt-3">
            <div className="flex gap-3 items-center w-full">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Add a comment..."
                className="bg-zinc-900 text-sm w-full outline-none border border-zinc-800 focus:border-accent rounded-full px-4 py-2 text-white"
              />

              <button
                onClick={handleAddComment}
                disabled={commentLoading || !commentText.trim()}
                className="text-accent font-bold p-2 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
              >
                {commentLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
