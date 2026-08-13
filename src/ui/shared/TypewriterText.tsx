import { useEffect, useRef, useState } from "react";
import { playTypeTick } from "@/engine/audio";

interface TypewriterTextProps {
  text: string;
  /** ms per character. Default reads naturally for dialogue-length text. */
  speed?: number;
  /** play a soft key-tick per character via the ambient audio engine */
  sound?: boolean;
  className?: string;
  /** called once the full string has been typed out */
  onDone?: () => void;
  /** if true, skip the animation immediately (used for reduced-motion / replays) */
  instant?: boolean;
}

/**
 * Shared dialogue-reveal effect used by both the interrogation modal and any
 * theory-flow copy that wants the same "typed out live" feel. Deliberately
 * dependency-free (no external animation lib) — just a timed substring reveal.
 */
export function TypewriterText({
  text,
  speed = 18,
  sound = false,
  className,
  onDone,
  instant = false,
}: TypewriterTextProps) {
  const [shown, setShown] = useState(instant ? text.length : 0);
  const doneRef = useRef(false);

  useEffect(() => {
    setShown(instant ? text.length : 0);
    doneRef.current = false;
    if (instant) {
      onDone?.();
      return;
    }
    let cancelled = false;
    let i = 0;
    function tick() {
      if (cancelled) return;
      i += 1;
      setShown(i);
      if (sound && i % 2 === 0 && i < text.length) {
        try {
          playTypeTick();
        } catch {
          /* audio not available (e.g. no user gesture yet) — fail silently */
        }
      }
      if (i < text.length) {
        window.setTimeout(tick, speed);
      } else if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
    }
    const t = window.setTimeout(tick, speed);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, instant]);

  return (
    <span className={className}>
      {text.slice(0, shown)}
      {shown < text.length && <span className="animate-pulse opacity-70">▍</span>}
    </span>
  );
}
