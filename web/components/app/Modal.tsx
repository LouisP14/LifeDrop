"use client";

import { useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Escape key closes modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    // Focus trap: focus the dialog on open
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative w-full animate-[slideUp_300ms_ease-out] md:animate-[scaleIn_200ms_ease-out] outline-none ${
          fullScreen
            ? "h-full overflow-y-auto bg-(--color-bg) max-w-lg"
            : "max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl bg-(--color-bg) pb-8 max-w-lg md:mx-4"
        }`}
      >
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="sticky top-0 z-10 ml-auto mr-4 mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-(--color-surface) text-(--color-text-muted) hover:text-(--color-text) focus:outline-2 focus:outline-(--color-primary)"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
