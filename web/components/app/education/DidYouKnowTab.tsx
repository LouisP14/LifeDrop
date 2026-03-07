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

function Card({ card }: { card: (typeof DID_YOU_KNOW)[number] }) {
  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 md:p-6 transition-all hover:shadow-sm">
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${card.color}15`, color: card.color }}
        >
          {ICON_MAP[card.icon] ?? <Droplets className="h-5 w-5" />}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-(--color-text-muted)">
          {card.category}
        </span>
      </div>
      <h3 className="mb-2 text-sm md:text-base font-bold">{card.title}</h3>
      <p className="text-sm leading-relaxed text-(--color-text-muted)">
        {card.content}
      </p>
    </div>
  );
}

export function DidYouKnowTab() {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Mobile: horizontal carousel */}
      <div className="md:hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 scrollbar-none">
          {DID_YOU_KNOW.map((card, i) => (
            <div
              key={card.id}
              className="w-[85%] shrink-0 snap-center"
              onTouchStart={() => setActive(i)}
            >
              <Card card={card} />
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

      {/* Desktop: grid layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        {DID_YOU_KNOW.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
