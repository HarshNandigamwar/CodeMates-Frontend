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
} from "lucide-react";
import AuthWrapper from "@/components/AuthWrapper";
import { toast } from "sonner";
import PostCard from "@/components/PostCard";
import ProfilePageLoader from "@/components/SkeletonLoders/ProfilePageLoader";

export default function ProfilePage() {
  const { username } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          <div className="relative -mt-24 flex flex-col md:flex-row md:items-end md:gap-6">
            {/* Profile Picture */}
            <div className="relative h-32 w-32 md:h-44 md:w-44 rounded-2xl overflow-hidden border-4 border-[#0a0a0a] bg-zinc-800 shadow-2xl">
              <img
                src={user.profilePic || "https://placehold.co/200x200"}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="mt-4 md:mb-4 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {user.name}
                  </h1>
                  <p className="text-zinc-400">@{user.username}</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-black font-bold px-6 py-2.5 rounded-xl transition-all">
                  <Edit3 size={18} /> Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-6 mt-8 py-4 border-y border-zinc-800/50">
            <div className="text-center">
              <span className="font-bold text-lg">{user.postsCount}</span>{" "}
              <p className="text-zinc-500 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <span className="font-bold text-lg">{user.followersCount}</span>{" "}
              <p className="text-zinc-500 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <span className="font-bold text-lg">{user.followingCount}</span>{" "}
              <p className="text-zinc-500 text-sm">Following</p>
            </div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Sidebar (Left) */}
            <div className="space-y-6">
              <div className="bg-[#111111] p-6 rounded-2xl border border-zinc-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Layers size={20} className="text-accent" /> About
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {user.bio}
                </p>

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
              <div className="bg-[#111111] p-6 rounded-2xl border border-zinc-800">
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

            {/* Posts Area (Right) */}
            <div className="lg:col-span-2">
              <div className="flex gap-4 mb-6 border-b border-zinc-800">
                <button className="pb-4 border-b-2 border-accent text-accent font-medium">
                  Posts
                </button>
                <button className="pb-4 text-zinc-500 hover:text-white transition-colors">
                  Media
                </button>
              </div>

              {posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {" "}
                  {/* Mobile aur Desktop dono ke liye stack layout */}
                  {posts.map((post: any) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
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
