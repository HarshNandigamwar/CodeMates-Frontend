"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
  Github,
  Linkedin,
  Globe,
  Calendar,
  Edit3,
  Code2,
  Layers,
  Heart,
  MessageCircle,
  X,
  Loader2,
  Send,
  Trash2,
} from "lucide-react";
import AuthWrapper from "@/components/AuthWrapper";
import { toast } from "sonner";
import PostCard from "@/components/PostCard";
import ProfilePageLoader from "@/components/SkeletonLoders/ProfilePageLoader";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const { username } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gride");
  const { user: currentUser } = useSelector((state: any) => state.auth);

  // Fetch user profile
  useEffect(() => {
    if (!username) return;
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/auth/profile/${username}`);
        setData(res.data);
        setLoading(false);
      } catch (error: any) {
        console.error("Profile Fetch Error:", error.response);
        setLoading(false);
        if (error.response?.status === 404) {
          toast.error("User not found on server");
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [username]);
  // Open and Close Post Model
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const openModal = (post: any) => {
    setSelectedPost(post);
    // document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setSelectedPost(null);
    // document.body.style.overflow = "auto";
  };
  // Add like on post
  const handleLikePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPost) return;
    try {
      const res = await axiosInstance.put(`/posts/like/${selectedPost._id}`);
      setSelectedPost(res.data);
      setData((prev: any) => ({
        ...prev,
        posts: prev.posts.map((p: any) =>
          p._id === res.data._id ? res.data : p
        ),
      }));
    } catch (error) {
      toast.error("Failed to like post");
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
        `/posts/comment/${selectedPost._id}`,
        {
          text: commentText,
        }
      );
      setSelectedPost(res.data);
      setCommentText("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setCommentLoading(false);
    }
  };
  // Edit Post
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const startEditing = () => {
    setEditContent(selectedPost.content);
    setIsEditing(true);
  };
  const handleEditPost = async () => {
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", editContent);
      if (editFile) {
        formData.append("url", editFile);
      }

      const res = await axiosInstance.put(
        `/posts/edit/${selectedPost._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update States
      setSelectedPost(res.data);
      setData((prev: any) => ({
        ...prev,
        posts: prev.posts.map((p: any) =>
          p._id === res.data._id ? res.data : p
        ),
      }));

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
  const handleDeleteModalPost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      toast.success("Post deleted successfully");
      closeModal();
      setData((prev: any) => ({
        ...prev,
        posts: prev.posts.filter((p: any) => p._id !== postId),
        user: {
          ...prev.user,
          postsCount: prev.user.postsCount - 1,
        },
      }));
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  if (loading)
    return (
      <>
        <ProfilePageLoader />
      </>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center text-accent font-bold font-mono mt-56 text-center text-2xl md:text-4xl">
        User not found!
      </div>
    );

  const { user, posts } = data;

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mt-24 flex flex-col md:flex-row md:gap-6 items-center md:items-start">
            {/* Profile Picture */}
            <div className="relative h-32 w-32 md:h-44 md:w-44 rounded-2xl overflow-hidden border-4 border-[#0a0a0a] bg-zinc-800 shadow-2xl">
              <img
                src={user.profilePic || "https://placehold.co/200x200"}
                loading="lazy"
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Basic Info */}
            <div className="mt-4 md:mb-4 flex-1 text-center md:text-start ">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  {/* Name */}
                  <h1 className="text-3xl font-bold tracking-tight">
                    {user.name}
                  </h1>
                  {/* UserName */}
                  <p className="text-zinc-400">{user.username}</p>
                  {/* Status bar */}
                  <div className="flex gap-6 py-4 justify-center md:justify-start">
                    {/* Post */}
                    <div className="text-center">
                      <span className="font-bold text-lg">
                        {user.postsCount}
                      </span>{" "}
                      <p className="text-zinc-500 text-sm">Posts</p>
                    </div>
                    {/* Followers */}
                    <div className="text-center cursor-pointer">
                      <span className="font-bold text-lg">
                        {user.followersCount}
                      </span>{" "}
                      <p className="text-zinc-500 text-sm">Followers</p>
                    </div>
                    {/* Following */}
                    <div className="text-center cursor-pointer">
                      <span className="font-bold text-lg">
                        {user.followingCount}
                      </span>{" "}
                      <p className="text-zinc-500 text-sm">Following</p>
                    </div>
                  </div>
                </div>
                {/* Edit Profile button */}
                <button className="text-accent hover:text-accent-hover border rounded-md p-2 bg-accent/10 cursor-pointer flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all">
                  <Edit3 size={18} /> Edit Profile
                </button>
              </div>
            </div>
          </div>
          {/* About & TechStack */}
          <div className="flex flex-col md:flex-row gap-2 mt-4 justify-center">
            {/* About Card */}
            <div className="bg-[#111111] p-6 rounded-2xl border border-zinc-800 md:w-[50%]">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Layers size={20} className="text-accent" /> About
              </h3>
              {/* Bio */}
              <p className="text-zinc-300 text-sm leading-relaxed">
                {user.bio}
              </p>
              {/* Social Links */}
              <div className="mt-6 space-y-3">
                <SocialLink
                  icon={<Github size={18} />}
                  label="GitHub"
                  href={user.github}
                />
                <SocialLink
                  icon={<Linkedin size={18} />}
                  label="LinkedIn"
                  href={user.linkedin}
                />
                <SocialLink
                  icon={<Globe size={18} />}
                  label="Portfolio"
                  href={user.portfolio}
                />
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <Calendar size={18} /> Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {/* Tech Stack Card */}
            <div className="bg-[#111111] p-6 rounded-2xl border border-zinc-800 md:w-[50%]">
              {/* Tech Stack */}
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Code2 size={20} className="text-accent" /> Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.techstack.map((tech: string) => (
                  <span
                    key={tech}
                    className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Posts */}
          <div className="mt-5">
            <div className="lg:col-span-2">
              {/* Tabs Navigation */}
              <div className="flex items-center justify-center gap-10 mb-6 border-b border-zinc-800">
                <button
                  onClick={() => setActiveTab("gride")}
                  className={`pb-4 text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "gride"
                      ? " text-accent"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  GRIDE
                </button>
                <button
                  onClick={() => setActiveTab("list")}
                  className={`pb-4 text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "list"
                      ? " text-accent"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  LIST
                </button>
              </div>
              {/* Content Display */}
              {posts.length > 0 ? (
                <>
                  {activeTab === "gride" && (
                    <div className="grid grid-cols-3 gap-1 md:gap-4">
                      {posts.map((post: any) => (
                        <div
                          key={post._id}
                          onClick={() => openModal(post)}
                          className="relative aspect-square group cursor-pointer overflow-hidden rounded-md md:rounded-lg bg-zinc-900"
                        >
                          {/* Image/Thumbnail */}
                          {post.mediaType !== "text" &&
                            (post.mediaType === "video" ? (
                              <video
                                src={post.url}
                                autoPlay={false}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={post.url}
                                alt="Post N/A"
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ))}

                          {/* Post Modal Overlay */}
                          {selectedPost && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm ">
                              {/* Close Model Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeModal();
                                }}
                                className="absolute top-6 right-6 p-2 text-white hover:text-accent bg-zinc-800/50 rounded-full transition-all z-[120] cursor-pointer"
                              >
                                <X size={28} />
                              </button>
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#111111] w-full max-w-5xl h-full max-h-[90vh] rounded-2xl overflow-hidden border border-zinc-800 flex flex-col md:flex-row"
                              >
                                <div className="w-full md:w-[60%] bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800">
                                  {selectedPost.mediaType === "video" ? (
                                    <video
                                      src={selectedPost.url}
                                      controls
                                      className="w-full max-h-full"
                                    />
                                  ) : (
                                    <img
                                      src={selectedPost.url}
                                      alt="post"
                                      loading="lazy"
                                      className="w-full h-full object-contain"
                                    />
                                  )}
                                </div>
                                {/* Right Side: Details & Comments */}
                                <div className="w-full md:w-[40%] flex flex-col h-full">
                                  {/* Header */}
                                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                    {/* User Info... */}
                                    <span className="flex items-center gap-2">
                                      <img
                                        src={
                                          selectedPost.user.profilePic ||
                                          "https://placehold.co/100x100"
                                        }
                                        loading="lazy"
                                        className="w-8 h-8 rounded-full border border-accent/30"
                                      />
                                      <div className="flex flex-col">
                                        <span className="font-bold text-sm">
                                          {selectedPost.user.name}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                          {selectedPost.user.username}
                                        </span>
                                      </div>
                                    </span>
                                    {/* Edit and Delete post */}
                                    <div className="flex items-center gap-2">
                                      {currentUser?._id ===
                                        selectedPost.user._id &&
                                        !isEditing && (
                                          <>
                                            <button
                                              onClick={startEditing}
                                              className="text-zinc-400 hover:text-accent p-1 cursor-pointer"
                                            >
                                              <Edit3 size={18} />
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleDeleteModalPost(
                                                  selectedPost._id
                                                )
                                              }
                                              className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                                            >
                                              <Trash2 size={18} />
                                            </button>
                                          </>
                                        )}
                                    </div>
                                  </div>
                                  {/* Caption & Comments*/}
                                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {isEditing ? (
                                      <div className="space-y-4">
                                        <label className="text-xs text-zinc-500 font-bold uppercase">
                                          Edit Caption
                                        </label>
                                        <textarea
                                          value={editContent}
                                          onChange={(e) =>
                                            setEditContent(e.target.value)
                                          }
                                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-accent min-h-[100px]"
                                        />

                                        <label className="text-xs text-zinc-500 font-bold uppercase block">
                                          Change Media (Optional)
                                        </label>
                                        <input
                                          type="file"
                                          onChange={(e) =>
                                            setEditFile(
                                              e.target.files?.[0] || null
                                            )
                                          }
                                          className="text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer"
                                        />

                                        <div className="flex gap-2 pt-2">
                                          <button
                                            onClick={handleEditPost}
                                            disabled={editLoading}
                                            className="flex-1 bg-accent text-black font-bold py-2 rounded-lg text-sm hover:bg-accent/90 disabled:opacity-50"
                                          >
                                            {editLoading ? (
                                              <Loader2
                                                className="animate-spin mx-auto"
                                                size={18}
                                              />
                                            ) : (
                                              "Save Changes"
                                            )}
                                          </button>
                                          <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 bg-zinc-800 text-white font-bold py-2 rounded-lg text-sm hover:bg-zinc-700"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                        <p className="text-sm text-zinc-300">
                                          {selectedPost.content}
                                        </p>
                                        <hr className="border-zinc-800" />

                                        <div className="space-y-4">
                                          {selectedPost.comments &&
                                          selectedPost.comments.length > 0 ? (
                                            selectedPost.comments.map(
                                              (comment: any) => (
                                                <div
                                                  key={comment._id}
                                                  className="flex gap-2 animate-in fade-in duration-300"
                                                >
                                                  <div className="w-6 h-6 rounded-full bg-zinc-800 shrink-0 overflow-hidden border border-zinc-700">
                                                    <img
                                                      src={
                                                        comment.profilePic ||
                                                        "https://placehold.co/100x100"
                                                      }
                                                      loading="lazy"
                                                      className="w-full h-full object-cover"
                                                    />
                                                  </div>
                                                  <div className="bg-zinc-900/50 p-2.5 rounded-xl flex-1 border border-zinc-800/50">
                                                    <p className="text-[11px] font-bold text-accent mb-0.5">
                                                      {comment.name || "user"}
                                                    </p>
                                                    <p className="text-xs text-zinc-200 leading-snug">
                                                      {comment.text}
                                                    </p>
                                                  </div>
                                                </div>
                                              )
                                            )
                                          ) : (
                                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                              <div className="p-3 bg-zinc-900/50 rounded-full mb-3">
                                                <MessageCircle
                                                  size={24}
                                                  className="text-zinc-600"
                                                />
                                              </div>
                                              <p className="text-xs text-zinc-500 italic">
                                                No comments yet.
                                              </p>
                                              <p className="text-[10px] text-zinc-600 mt-1 text-accent/80 font-medium">
                                                Be the first to share your
                                                thoughts!
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Footer: Likes & Quick Comment */}
                                  <div className="p-4 border-t border-zinc-800">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={handleLikePost}
                                        className="hover:scale-110 active:scale-125 transition-all cursor-pointer"
                                      >
                                        <Heart
                                          size={24}
                                          className={
                                            selectedPost.likes?.includes(
                                              currentUser?._id
                                            )
                                              ? "fill-red-500 text-red-500"
                                              : "text-zinc-400 hover:text-red-400"
                                          }
                                        />
                                      </button>
                                      <p className="text-xs font-bold text-zinc-300">
                                        {selectedPost.likes?.length || 0} likes
                                      </p>
                                    </div>
                                    {/* post comment */}
                                    <div className="p-4">
                                      <div className="flex gap-3 items-center">
                                        <input
                                          type="text"
                                          value={commentText}
                                          onChange={(e) =>
                                            setCommentText(e.target.value)
                                          }
                                          onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            handleAddComment()
                                          }
                                          placeholder="Add a comment..."
                                          className="bg-zinc-900 text-sm w-full outline-none border border-zinc-800 focus:border-accent rounded-full px-4 py-2 text-white"
                                        />
                                        <button
                                          onClick={handleAddComment}
                                          disabled={
                                            commentLoading ||
                                            !commentText.trim()
                                          }
                                          className="text-accent font-bold text-sm disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
                                        >
                                          {commentLoading ? (
                                            <Loader2 className="animate-spin" />
                                          ) : (
                                            <Send className="text-accent" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Hover Overlay: Like/Comment Count */}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex gap-4 text-white font-bold">
                              <div className="flex items-center gap-1">
                                <Heart size={20} className="fill-white" />
                                <span>{post.likes?.length || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle
                                  size={20}
                                  className="fill-white"
                                />
                                <span>{post.comments?.length || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === "list" && (
                    <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                      {posts.map((post: any) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-[#111111] rounded-3xl border-2 border-dashed border-zinc-800">
                  <p className="text-zinc-500">No posts yet from this user.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}

// Reusable Social Link Component
function SocialLink({
  icon,
  label,
  href,
}: {
  icon: any;
  label: string;
  href: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 text-zinc-400 hover:text-accent transition-colors text-sm"
    >
      {icon} <span>{label}</span>
    </a>
  );
}
