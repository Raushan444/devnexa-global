export default function SkeletonLoader({
  width = "100%",
  height = "20px",
  rounded = "8px",
  className = "",
}: {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: rounded }}
      aria-hidden="true"
    />
  );
}
