interface LogoProps {
  size?: number;
}

export function Logo({ size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="60" y1="22" x2="60" y2="93" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f87171" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      {/* Anneau decoratif pointille */}
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="#f87171"
        strokeWidth="1.5"
        strokeDasharray="8 5"
        fill="none"
        opacity={0.4}
      />
      {/* Goutte de sang */}
      <path
        d="M60 22 C60 22 34 52 34 68 C34 82 46 93 60 93 C74 93 86 82 86 68 C86 52 60 22 60 22Z"
        fill="url(#logo-gradient)"
      />
    </svg>
  );
}
