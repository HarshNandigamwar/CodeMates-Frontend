import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SearchUserPageLoader() {
  const skeletons = [1, 2, 3, 4, 5];

  return (
    <SkeletonTheme baseColor="#1a1a1a" highlightColor="#262626">
      <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto mt-4">
        {skeletons.map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-[#111111] p-3 rounded-xl border border-zinc-800"
          >
            {/* Profile Avatar Skeleton */}
            <div className="shrink-0">
              <Skeleton circle width={50} height={50} />
            </div>

            {/* User Info Skeleton */}
            <div className="flex-1 space-y-2">
              <Skeleton width="40%" height={14} /> {/* Name */}
              <Skeleton width="25%" height={10} /> {/* Username */}
            </div>

            {/* Follow/View Profile Button Skeleton */}
            <div className="shrink-0">
              <Skeleton width={80} height={32} borderRadius={8} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}
