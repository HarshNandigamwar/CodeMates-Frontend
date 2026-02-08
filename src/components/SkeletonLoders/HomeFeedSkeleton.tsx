import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Heart, MessageCircle } from "lucide-react";

export default function HomeFeedSkeleton() {
  const skeletons = [1, 2];

  return (
    <SkeletonTheme baseColor="#1a1a1a" highlightColor="#262626">
      <div className="flex flex-col gap-8 max-w-2xl mx-auto px-4">
        {skeletons.map((i) => (
          <div
            key={i}
            className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden p-4"
          >
            {/* Header: Profile Pic + Name */}
            <div className="flex items-center gap-3 mb-4">
              <Skeleton circle width={40} height={40} />
              <div className="flex-1">
                <Skeleton width="40%" height={15} />
                <Skeleton
                  width="25%"
                  height={10}
                  style={{ marginTop: "5px" }}
                />
              </div>
            </div>

            {/* Post Content / Caption */}
            <div className="mb-4">
              <Skeleton count={1} width="80%" />
            </div>

            {/* Media Area (Square) */}
            <div className="rounded-xl overflow-hidden mb-4">
              <Skeleton height={400} />
            </div>

            {/* Footer: Icons + Likes */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Heart size={22} className="text-zinc-800" />
                <MessageCircle size={22} className="text-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}
