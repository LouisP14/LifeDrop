"use client";

import { useState, useMemo } from "react";
import { MapPin, Search, Phone, Navigation, Building2 } from "lucide-react";
import { DONATION_CENTERS, type DonationCenter } from "@shared/data/centers";

export function CentersTab() {
  const [search, setSearch] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return DONATION_CENTERS;
    const q = search.toLowerCase();
    return DONATION_CENTERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q),
    );
  }, [search]);

  // Group by city
  const grouped = useMemo(() => {
    const map = new Map<string, DonationCenter[]>();
    for (const c of filtered) {
      const list = map.get(c.city) ?? [];
      list.push(c);
      map.set(c.city, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const openMaps = (c: DonationCenter) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name + " " + c.address)}`,
      "_blank",
    );
  };

  return (
    <div className="px-4 pt-6 md:px-8 md:pt-8 animate-[fadeInUp_400ms_ease-out]">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-primary)/10">
          <Building2 className="h-7 w-7 text-(--color-primary)" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold">Centres de don</h2>
        <p className="mt-1 text-sm text-(--color-text-muted)">
          Trouve un centre EFS pres de chez toi
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-text-muted)" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une ville ou un centre..."
          className="w-full rounded-xl border border-(--color-border) bg-(--color-surface) pl-11 pr-4 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/50 outline-none focus:border-(--color-primary)"
        />
      </div>

      {/* Results count */}
      <p className="mb-3 text-xs text-(--color-text-muted)">
        {filtered.length} centre{filtered.length !== 1 ? "s" : ""} trouve{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center">
          <MapPin className="mx-auto mb-3 h-8 w-8 text-(--color-text-muted)/30" />
          <p className="text-sm text-(--color-text-muted)">
            Aucun centre trouve pour &quot;{search}&quot;
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([city, centers]) => (
            <div key={city}>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-(--color-text-muted)">
                <MapPin className="h-3.5 w-3.5" />
                {city}
                <span className="text-xs font-normal">({centers.length})</span>
              </h3>
              <div className="space-y-2">
                {centers.map((c) => {
                  const isSelected = selectedCenter === c;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedCenter(isSelected ? null : c)}
                      className="w-full rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 text-left transition-all hover:border-(--color-primary)/30 hover:shadow-sm active:scale-[0.99]"
                      style={isSelected ? { borderColor: "var(--color-primary)", backgroundColor: "rgba(248,113,113,0.05)" } : undefined}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-primary)/10">
                          <Building2 className="h-5 w-5 text-(--color-primary)" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold">{c.name}</p>
                          <p className="mt-0.5 text-xs text-(--color-text-muted)">{c.address}</p>
                          {c.phone && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-(--color-text-muted)">
                              <Phone className="h-3 w-3" /> {c.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openMaps(c); }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-(--color-primary) py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                          >
                            <Navigation className="h-4 w-4" />
                            Itineraire
                          </button>
                          {c.phone && (
                            <a
                              href={`tel:${c.phone.replace(/\s/g, "")}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center gap-2 rounded-xl border border-(--color-border) px-4 py-2.5 text-sm font-bold text-(--color-text-muted) transition-all hover:border-(--color-primary) hover:text-(--color-primary)"
                            >
                              <Phone className="h-4 w-4" />
                              Appeler
                            </a>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 mb-4 text-center text-[10px] text-(--color-text-muted)">
        Donnees basees sur les sites EFS connus. Pour la liste complete, consulte dondesang.efs.sante.fr
      </p>
    </div>
  );
}
