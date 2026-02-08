import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProfilePageLoader() {
  return (
    <SkeletonTheme baseColor="#1a1a1a" highlightColor="#262626">
      <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header Skeleton */}
          <div className="relative flex flex-col md:flex-row md:gap-8 items-center md:items-start mb-10">
            {/* Avatar */}
            <div className="shrink-0">
              <Skeleton width={160} height={160} borderRadius={16} />
            </div>

            <div className="mt-6 md:mt-2 flex-1 w-full">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                <div className="w-full text-center md:text-left">
                  <Skeleton width={200} height={28} /> {/* Name */}
                  <div className="mt-2">
                    <Skeleton width={120} height={16} /> {/* Username */}
                  </div>
                  
                  {/* Stats (Posts, Followers, Following) */}
                  <div className="flex gap-8 mt-6 justify-center md:justify-start">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="text-center">
                        <Skeleton width={40} height={20} />
                        <Skeleton width={60} height={12} style={{ marginTop: '4px' }} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Button */}
                <Skeleton width={140} height={40} borderRadius={8} />
              </div>
            </div>
          </div>

          {/* About & Tech Stack Skeleton Cards */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="bg-[#111111] p-6 rounded-2xl border border-zinc-800 flex-1">
              <Skeleton width={100} height={20} className="mb-4" />
              <Skeleton count={3} />
            </div>
            <div className="bg-[#111111] p-6 rounded-2xl border border-zinc-800 flex-1">
              <Skeleton width={120} height={20} className="mb-4" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} width={60} height={24} borderRadius={20} />
                ))}
              </div>
            </div>
          </div>

          {/* Post Tabs & Grid Skeleton */}
          <div className="mt-10">
            <div className="flex justify-center gap-10 mb-6 border-b border-zinc-800 pb-4">
              <Skeleton width={80} height={20} />
              <Skeleton width={80} height={20} />
            </div>

            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square">
                  <Skeleton height="100%" borderRadius={8} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </SkeletonTheme>
  );
}
