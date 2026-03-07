"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Droplets, Clock, FlaskConical, MapPin, Pencil,
} from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { DONATION_TYPE_LABELS, DONATION_TYPE_COLORS, LIVES_PER_DONATION_TYPE } from "@shared/constants";
import { Modal } from "../Modal";
import type { Donation, DonationType } from "@shared/types";

const TYPE_ICONS: Record<DonationType, React.ReactNode> = {
  whole_blood: <Droplets className="h-4 w-4" />,
  platelets: <Clock className="h-4 w-4" />,
  plasma: <FlaskConical className="h-4 w-4" />,
};

const PAGE_SIZE = 10;

export function DonationHistoryModal({
  onClose,
  onEdit,
}: {
  onClose: () => void;
  onEdit: (donation: Donation) => void;
}) {
  const donations = useAppStore((s) => s.donations);
  const [page, setPage] = useState(1);

  const sorted = [...donations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(0, page * PAGE_SIZE);
  const hasMore = page < totalPages;

  return (
    <Modal onClose={onClose}>
      <div className="px-6 pb-4 pt-2">
        <h3 className="mb-4 text-lg font-extrabold">
          Historique des dons
          <span className="ml-2 text-sm font-normal text-(--color-text-muted)">
            {donations.length} don{donations.length !== 1 ? "s" : ""}
          </span>
        </h3>

        {sorted.length === 0 ? (
          <div className="py-12 text-center">
            <Droplets className="mx-auto mb-3 h-8 w-8 text-(--color-text-muted)/30" />
            <p className="text-sm text-(--color-text-muted)">Aucun don enregistre.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {paginated.map((d) => {
              const colors = DONATION_TYPE_COLORS[d.type];
              return (
                <button
                  key={d.id}
                  onClick={() => onEdit(d)}
                  className="flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all hover:shadow-sm hover:opacity-80 active:scale-[0.98]"
                  style={{ borderColor: colors.border, backgroundColor: colors.bg }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${colors.main}15`, color: colors.main }}
                  >
                    {TYPE_ICONS[d.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{DONATION_TYPE_LABELS[d.type].label}</p>
                    <p className="text-xs text-(--color-text-muted)">
                      {format(new Date(d.date), "d MMM yyyy", { locale: fr })}
                      {d.location && (
                        <span className="ml-1.5">
                          <MapPin className="inline h-3 w-3" /> {d.location}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: colors.main }}>
                      {LIVES_PER_DONATION_TYPE[d.type]} {LIVES_PER_DONATION_TYPE[d.type] === 1 ? "vie" : "vies"}
                    </span>
                    <Pencil className="h-3 w-3 text-(--color-text-muted)" />
                  </div>
                </button>
              );
            })}

            {hasMore && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="w-full rounded-xl border border-(--color-border) py-2.5 text-sm font-medium text-(--color-primary) transition-all hover:bg-(--color-primary)/5"
              >
                Voir plus ({sorted.length - paginated.length} restants)
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
