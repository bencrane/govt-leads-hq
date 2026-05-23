/**
 * Motion primitives — token-bound wrappers around framer-motion.
 *
 * Durations + easings come from `@govt-leads-hq/tokens` `motion.*`. Each
 * primitive defaults to `motion.duration.base` and `motion.easing.out`.
 * Every wrapper respects `prefers-reduced-motion` — when the OS reports
 * reduced motion the children render with no transition.
 */

import { motion as motionTokens } from "@govt-leads-hq/tokens";
import { type HTMLMotionProps, motion as fm, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type DurationKey = keyof typeof motionTokens.duration;
type EasingKey = keyof typeof motionTokens.easing;

function parseMs(s: string): number {
  return Number(s.replace("ms", ""));
}

function parseCubic(s: string): [number, number, number, number] {
  // "cubic-bezier(a, b, c, d)" → [a,b,c,d]
  const inside = s.replace(/^cubic-bezier\(/, "").replace(/\)$/, "");
  const parts = inside.split(",").map((p) => Number(p.trim()));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
    return [0.22, 1, 0.36, 1];
  }
  return parts as [number, number, number, number];
}

function transitionFor(d: DurationKey, e: EasingKey) {
  return {
    duration: parseMs(motionTokens.duration[d]) / 1000,
    ease: parseCubic(motionTokens.easing[e]),
  };
}

type MotionDivProps = Omit<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">;

interface MotionWrapperProps extends MotionDivProps {
  duration?: DurationKey;
  easing?: EasingKey;
  /** Delay before the animation starts (seconds). */
  delay?: number;
  children?: ReactNode;
}

// ─────────────────────── AppearOnMount ───────────────────────

export function AppearOnMount({
  duration = "base",
  easing = "out",
  delay = 0,
  children,
  ...rest
}: MotionWrapperProps) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div {...(rest as Record<string, unknown>)}>{children}</div>;
  }
  return (
    <fm.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...transitionFor(duration, easing), delay }}
      {...rest}
    >
      {children}
    </fm.div>
  );
}

// ─────────────────────── FadeIn ───────────────────────

export function FadeIn({
  duration = "base",
  easing = "out",
  delay = 0,
  children,
  ...rest
}: MotionWrapperProps) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div {...(rest as Record<string, unknown>)}>{children}</div>;
  }
  return (
    <fm.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ...transitionFor(duration, easing), delay }}
      {...rest}
    >
      {children}
    </fm.div>
  );
}

// ─────────────────────── SlideIn ───────────────────────

export interface SlideInProps extends MotionWrapperProps {
  from?: "top" | "bottom" | "left" | "right";
  distance?: number;
}

export function SlideIn({
  from = "bottom",
  distance = 8,
  duration = "base",
  easing = "out",
  delay = 0,
  children,
  ...rest
}: SlideInProps) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div {...(rest as Record<string, unknown>)}>{children}</div>;
  }
  const offset =
    from === "top"
      ? { y: -distance }
      : from === "bottom"
        ? { y: distance }
        : from === "left"
          ? { x: -distance }
          : { x: distance };
  return (
    <fm.div
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ ...transitionFor(duration, easing), delay }}
      {...rest}
    >
      {children}
    </fm.div>
  );
}
