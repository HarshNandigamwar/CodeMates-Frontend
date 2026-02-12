"use client";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  Loader2,
  Trash2,
  Edit3,
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPost, setCurrentPost] = useState(initialPost);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isOwner = currentUser?._id === currentPost.user._id;

  // Add like on post
  const isLiked = currentPost.likes.includes(user?._id);
  const handleLike = async () => {
    if (!user) return toast.error("Please login to like");
    try {
      const res = await axiosInstance.put(`/posts/like/${currentPost._id}`);
      setCurrentPost({
        ...res.data,
        user: currentPost.user,
      });
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
      setCurrentPost({
        ...res.data,
        user: currentPost.user,
      });
      setCommentText("");
      toast.success("Comment added!");
    } catch (error: any) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Edit Post
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(currentPost.content);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const handleEditPost = async () => {
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", editContent);
      if (editFile) {
        formData.append("url", editFile);
      }
      const res = await axiosInstance.put(
        `/posts/edit/${currentPost._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setCurrentPost({
        ...res.data,
        user: currentPost.user,
      });
      setIsEditing(false);
      setEditFile(null);
      toast.success("Post updated!");
    } catch (error) {
      toast.error("Failed to update post");
    } finally {
      setEditLoading(false);
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
            loading="lazy"
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
          {isOwner && (
            <div>
              {/* Dropdown Menu button */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-zinc-500 hover:text-white p-2 cursor-pointer"
              >
                <MoreVertical size={18} />
              </button>
              {/* Dropdown Menu */}
              {showDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden`}
                >
                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setIsEditing(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleDelete();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className=" border border-zinc-800 overflow-hidden mb-6">
        <div className="p-4">
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm outline-none focus:border-accent min-h-[100px] text-white"
                placeholder="What's on your mind?"
              />
              <input
                type="file"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                className="text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-300 cursor-pointer"
              />
              {/* Buttons */}
              <div className="flex gap-2">
                {/* Save Button */}
                <button
                  onClick={handleEditPost}
                  disabled={editLoading}
                  className="flex-1 bg-accent text-black font-bold py-2 rounded-lg text-sm disabled:opacity-50 items-center justify-center text-center "
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
                {/* Cancel BUtton */}
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-zinc-800 text-white py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Content Text */}
              <p className="text-zinc-300 text-sm mb-3">
                {currentPost.content}
              </p>
              {/* Media Display */}
              {currentPost.url && (
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black">
                  {currentPost.mediaType === "video" ? (
                    <video
                      src={currentPost.url}
                      controls
                      className="w-full max-h-[400px]"
                    />
                  ) : (
                    <img
                      src={currentPost.url}
                      alt="post"
                      className="w-full max-h-[400px] object-contain"
                      loading="lazy"
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

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
