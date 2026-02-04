import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface SkeletonProps {
  count?: number;
  height?: number | string;
  width?: number | string;
  circle?: boolean;
}

export default function GreenDarkSkeleton({
  count = 1,
  height,
  width,
  circle,
}: SkeletonProps) {
  return (
    <SkeletonTheme baseColor="#1a1a1a" highlightColor="#22c55e">
      <Skeleton
        count={count}
        height={height}
        width={width}
        circle={circle}
        className="opacity-50" // Optional: softens the green intensity
      />
    </SkeletonTheme>
  );
}
