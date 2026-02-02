"use client";
import React, { useEffect } from "react";
import CreatePost from "@/components/CreatePost";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPosts } from "@/store/slices/postSlice";
import { Loader2, Terminal, Code } from "lucide-react";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { posts, loading } = useAppSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR - User Info */}
        <aside className="hidden md:block md:col-span-3">
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 sticky top-24 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 border-2 border-emerald-500/30 flex items-center justify-center text-4xl font-bold text-emerald-500 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                {user?.name?.[0].toUpperCase() || "C"}
              </div>
              <h2 className="text-xl font-bold tracking-tight">{user?.name || "Guest Developer"}</h2>
              <p className="text-emerald-500 text-sm font-mono mt-1">@{user?.username || "anon"}</p>
              
              <div className="w-full grid grid-cols-2 gap-2 mt-6">
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Posts</p>
                  <p className="text-lg font-mono">0</p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Connections</p>
                  <p className="text-lg font-mono">0</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER FEED */}
        <main className="col-span-1 md:col-span-9 lg:col-span-6 space-y-6">
          <CreatePost />

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-500 h-10 w-10" />
            </div>
          ) : (
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post: any) => (
                  <div key={post._id} className="bg-[#121212] border border-white/5 rounded-2xl p-5 hover:border-emerald-500/20 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400">
                        {post.user?.name?.[0] || "D"}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{post.user?.name}</h4>
                        <p className="text-xs text-gray-500">@{post.user?.username}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{post.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-[#121212] border border-dashed border-white/10 rounded-2xl">
                  <Terminal className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500">The global feed is empty. Start a new thread!</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR - Trending */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 sticky top-24">
            <h3 className="flex items-center gap-2 font-bold text-emerald-500 mb-4 font-mono text-sm">
              <Code size={16} /> TRENDING_REPOS
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <p className="text-xs text-emerald-500/60 font-mono">system/v0.0.{i}</p>
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Build a Real-time Engine with Rust</p>
                  <p className="text-[10px] text-gray-600 mt-1">1.2k developers joined</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
