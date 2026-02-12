"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import PostCard from "@/components/PostCard";
import { Users } from "lucide-react";
import AuthWrapper from "@/components/AuthWrapper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import HomeFeedSkeleton from "@/components/SkeletonLoders/HomeFeedSkeleton";

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Fetch home feed
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axiosInstance.get("/posts/feed");
        setPosts(res.data);
      } catch (error: any) {
        console.error("Feed Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <AuthWrapper>
      <div className="bg-[#0a0a0a] text-white pb-20 pt-24">
        <div className="max-w-2xl mx-auto px-4">
          {/* Feed Content */}
          {loading ? (
            <HomeFeedSkeleton />
          ) : posts.length > 0 ? (
            <div className="flex flex-col gap-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
              <div className="p-4 bg-accent/10 rounded-full mb-4">
                <Users size={32} className="text-accent" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Your feed is quiet</h2>
              <p className="text-zinc-500 max-w-sm">
                Follow other developers to see their posts and updates here.
              </p>
              <button
                onClick={() => router.push("/search")}
                className="mt-6 bg-accent text-black font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform cursor-pointer"
              >
                Discover People
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}
