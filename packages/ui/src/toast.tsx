/**
 * Toast primitive — wraps `@radix-ui/react-toast`.
 *
 * `Toast` is the rendering surface (consumes a queue of toast instances
 * + an onDismiss callback). `useToastQueue` is a tiny imperative helper
 * for apps that don't already bring their own state library. Production
 * apps with zustand / jotai / redux can pass their own array and skip
 * the helper entirely (see ADR-09).
 */

import * as Toast$ from "@radix-ui/react-toast";
import { type ReactNode, useEffect, useState } from "react";
import { type BannerTone, bannerStyle } from "./feedback";
import { cx, textColor } from "./utils";

export type ToastTone = BannerTone;

export interface ToastInstance {
  id: string;
  tone?: ToastTone;
  title?: ReactNode;
  description?: ReactNode;
  /** ms before auto-dismiss; 0 disables. Default 5000. */
  duration?: number;
}

export interface ToastProps {
  /** Active toast queue. */
  toasts: ReadonlyArray<ToastInstance>;
  /** Called when a toast is dismissed (user or timeout). */
  onDismiss: (id: string) => void;
  /** Stack position; default top-right. */
  position?: "top-right" | "bottom-right";
}

const positionStyle = {
  "top-right": "top-4 right-4",
  "bottom-right": "bottom-4 right-4",
} as const;

/**
 * Toast region — render once at the app root. Pass an array of active
 * toasts and an `onDismiss` callback. The component handles the Radix
 * Provider + Viewport scaffolding; callers stay in control of the queue.
 */
export function Toast({ toasts, onDismiss, position = "top-right" }: ToastProps) {
  return (
    <Toast$.Provider swipeDirection="right" duration={5000}>
      {toasts.map((t) => (
        <Toast$.Root
          key={t.id}
          duration={t.duration ?? 5000}
          onOpenChange={(open) => {
            if (!open) onDismiss(t.id);
          }}
          className={cx(
            "pointer-events-auto rounded-none border px-4 py-3 shadow-lg",
            "min-w-[280px] max-w-[420px]",
            bannerStyle[t.tone ?? "info"],
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-4",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out",
          )}
        >
          {t.title ? (
            <Toast$.Title className="mb-1 font-mono text-mono-xs uppercase">{t.title}</Toast$.Title>
          ) : null}
          {t.description ? (
            <Toast$.Description className={cx("text-body-sm", textColor.default)}>
              {t.description}
            </Toast$.Description>
          ) : null}
        </Toast$.Root>
      ))}
      <Toast$.Viewport
        className={cx(
          "fixed z-[100] flex w-[420px] max-w-[100vw] flex-col gap-2 outline-none",
          positionStyle[position],
        )}
      />
    </Toast$.Provider>
  );
}

/**
 * Tiny imperative queue helper for stories + simple apps. Callers may
 * bring their own queue; this exists so the simple use-case (one-off
 * toasts in an app shell) doesn't force every consumer to wire a
 * reducer.
 */
export function useToastQueue() {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  function push(t: Omit<ToastInstance, "id"> & { id?: string }) {
    const id = t.id ?? `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((cur) => [...cur, { ...t, id }]);
    return id;
  }
  function dismiss(id: string) {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }
  // Guard against memory leak in StrictMode double-mount/unmount.
  useEffect(() => {
    return () => setToasts([]);
  }, []);
  return { toasts, push, dismiss };
}
