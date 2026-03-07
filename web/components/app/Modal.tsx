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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      />
      <div
        className={`relative w-full animate-[slideUp_300ms_ease-out] md:animate-[scaleIn_200ms_ease-out] ${
          fullScreen
            ? "h-full overflow-y-auto bg-(--color-bg) max-w-lg"
            : "max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl bg-(--color-bg) pb-8 max-w-lg md:mx-4"
        }`}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="sticky top-0 z-10 ml-auto mr-4 mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-(--color-surface) text-(--color-text-muted) hover:text-(--color-text)"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
