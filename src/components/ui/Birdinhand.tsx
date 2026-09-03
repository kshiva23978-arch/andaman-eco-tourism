interface BirdinhandProps {
  className?: string;
  rotate?: number;
  flip?: boolean;
  size?: number;
  opacity?: number;
}

export function Birdinhand({
    className = "",
    rotate = 0,
    flip = false,
    size = 140,
    opacity = 0.18,
}: BirdinhandProps) {
    return (
        <img
            src="/images/illustrations/bird-in-hand.png"
            alt="bird-in-hand"
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