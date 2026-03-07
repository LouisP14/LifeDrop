"use client";

import { useState } from "react";
import {
  Droplets, Users, FlaskConical, Timer, AlertTriangle,
  Hourglass, Snowflake, ShieldCheck, GlassWater, UserCheck,
} from "lucide-react";
import { DID_YOU_KNOW } from "@shared/content/did-you-know";

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets: <Droplets className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  "flask-conical": <FlaskConical className="h-5 w-5" />,
  timer: <Timer className="h-5 w-5" />,
  "alert-triangle": <AlertTriangle className="h-5 w-5" />,
  hourglass: <Hourglass className="h-5 w-5" />,
  snowflake: <Snowflake className="h-5 w-5" />,
  "shield-check": <ShieldCheck className="h-5 w-5" />,
  "glass-water": <GlassWater className="h-5 w-5" />,
  "user-check": <UserCheck className="h-5 w-5" />,
};

export function DidYouKnowTab() {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Carousel */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 scrollbar-none">
        {DID_YOU_KNOW.map((card, i) => (
          <div
            key={card.id}
            className="w-[85%] shrink-0 snap-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            onMouseEnter={() => setActive(i)}
          >
            <div className="mb-3 flex items-center gap-2">
              <span style={{ color: card.color }}>
                {ICON_MAP[card.icon] ?? <Droplets className="h-5 w-5" />}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                {card.category}
              </span>
            </div>
            <h3 className="mb-2 text-sm font-bold">{card.title}</h3>
            <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
              {card.content}
            </p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 pt-2">
        {DID_YOU_KNOW.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === active ? 16 : 6,
              backgroundColor: i === active ? "var(--color-primary)" : "var(--color-border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
