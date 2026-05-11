interface SkeletonProps {
  h?: number;
  w?: number | string;
  r?: number;
}

export function Skeleton({ h = 14, w = '100%', r = 6 }: SkeletonProps) {
  return <span className="skel" style={{ width: w, height: h, borderRadius: r }} />;
}

export function SkeletonCard() {
  return (
    <div className="stat">
      <Skeleton w={80} h={11} />
      <Skeleton w={120} h={28} r={8} />
      <Skeleton w={60} h={10} />
    </div>
  );
}
