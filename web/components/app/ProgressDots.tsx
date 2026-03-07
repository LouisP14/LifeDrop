"use client";

export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: i <= current ? 24 : 8,
            backgroundColor: i <= current ? "var(--color-primary)" : "var(--color-border)",
          }}
        />
      ))}
    </div>
  );
}
