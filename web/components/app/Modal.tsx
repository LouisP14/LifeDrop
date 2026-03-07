"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  children,
  onClose,
  fullScreen = false,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  fullScreen?: boolean;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/60 animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-lg animate-[slideUp_300ms_ease-out] ${
          fullScreen
            ? "h-full overflow-y-auto bg-[var(--color-bg)]"
            : "max-h-[90vh] overflow-y-auto rounded-t-2xl bg-[var(--color-bg)] pb-8"
        }`}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="sticky top-0 z-10 ml-auto mr-4 mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
