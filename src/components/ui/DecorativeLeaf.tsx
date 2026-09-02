interface DecorativeLeafProps {
  className?: string;
  rotate?: number;
  flip?: boolean;
  size?: number;
  opacity?: number;
}

export function DecorativeLeaf({
  className = "",
  rotate = 0,
  flip = false,
  size = 140,
  opacity = 0.18,
}: DecorativeLeafProps) {
  return (
    <img
      src="/images/bg/leaf.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        transform: `rotate(${rotate}deg)${flip ? " scaleX(-1)" : ""}`,
      }}
    />
  );
}
