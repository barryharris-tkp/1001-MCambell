import { useState, useRef, useEffect, useCallback } from "react";
import { VolumeX, Volume2, Flower2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MEDITATION_DURATION = 30_000;
const RAMP_DURATION = 5_000; // volume fade-in over 5 seconds
const FIXED_VOLUME = 0.3; // 30% — safe default level

// Pill dimensions
const PILL_W = 104;
const PILL_H = 48;
const CORNER_R = PILL_H / 2; // 24 — fully rounded ends
const STROKE_W = 2.5;

// Inset so stroke sits inside the pill border
const INSET = STROKE_W / 2;
const W = PILL_W - STROKE_W;
const H = PILL_H - STROKE_W;
const R = CORNER_R - INSET;

// Perimeter of the rounded rectangle
const STRAIGHT_X = W - 2 * R;
const STRAIGHT_Y = H - 2 * R;
const PERIMETER = 2 * STRAIGHT_X + 2 * STRAIGHT_Y + 2 * Math.PI * R;

/** SVG path tracing the pill starting from top-center, clockwise */
function buildPillPath(): string {
  const x0 = INSET + R; // left edge of top straight
  const x1 = INSET + R + STRAIGHT_X; // right edge of top straight
  const y0 = INSET;
  const y1 = INSET + H;

  return [
    `M ${PILL_W / 2} ${y0}`, // start top-center
    `L ${x1} ${y0}`, // top-right straight
    `A ${R} ${R} 0 0 1 ${x1 + R} ${y0 + R}`, // top-right arc
    `L ${x1 + R} ${y0 + R + STRAIGHT_Y}`, // right side
    `A ${R} ${R} 0 0 1 ${x1} ${y1}`, // bottom-right arc
    `L ${x0} ${y1}`, // bottom straight
    `A ${R} ${R} 0 0 1 ${x0 - R} ${y1 - R}`, // bottom-left arc
    `L ${x0 - R} ${y0 + R}`, // left side
    `A ${R} ${R} 0 0 1 ${x0} ${y0}`, // top-left arc
    `Z`,
  ].join(" ");
}

const pillPath = buildPillPath();

function CountdownRing({ progress }: { progress: number }) {
  const offset = PERIMETER * (1 - progress);
  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={PILL_W}
      height={PILL_H}
      viewBox={`0 0 ${PILL_W} ${PILL_H}`}
    >
      {/* background track */}
      <path
        d={pillPath}
        fill="none"
        stroke="hsl(38 75% 50% / 0.2)"
        strokeWidth={STROKE_W}
      />
      {/* animated progress */}
      <path
        d={pillPath}
        fill="none"
        stroke="hsl(38 75% 50%)"
        strokeWidth={STROKE_W}
        strokeLinecap="round"
        strokeDasharray={PERIMETER}
        strokeDashoffset={offset}
        style={{
          filter: "drop-shadow(0 0 4px hsl(38 75% 50% / 0.6))",
          transition: "stroke-dashoffset 0.25s linear",
        }}
      />
    </svg>
  );
}

const AmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMeditationHint, setShowMeditationHint] = useState(false);
  const [isMeditating, setIsMeditating] = useState(false);
  const [meditationProgress, setMeditationProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const meditationTimerRef = useRef<number | null>(null);
  const meditationStartRef = useRef<number>(0);
  const volumeRampRef = useRef<number | null>(null);
  const rampStartRef = useRef<number>(0);
  const prevMeditatingRef = useRef(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = FIXED_VOLUME;
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const cancelVolumeRamp = useCallback(() => {
    if (volumeRampRef.current !== null) {
      cancelAnimationFrame(volumeRampRef.current);
      volumeRampRef.current = null;
    }
  }, []);

  const rampVolumeUp = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0;
    rampStartRef.current = Date.now();

    const tick = () => {
      if (!audioRef.current) {
        volumeRampRef.current = null;
        return;
      }
      const elapsed = Date.now() - rampStartRef.current;
      const t = Math.min(elapsed / RAMP_DURATION, 1);
      audioRef.current.volume = t * FIXED_VOLUME;

      if (t < 1) {
        volumeRampRef.current = requestAnimationFrame(tick);
      } else {
        volumeRampRef.current = null;
      }
    };

    volumeRampRef.current = requestAnimationFrame(tick);
  }, []);

  const endMeditation = useCallback(() => {
    setIsMeditating(false);
    setMeditationProgress(0);
    cancelVolumeRamp();
    if (audioRef.current) {
      audioRef.current.volume = FIXED_VOLUME;
    }
    if (meditationTimerRef.current !== null) {
      cancelAnimationFrame(meditationTimerRef.current);
      meditationTimerRef.current = null;
    }
  }, [cancelVolumeRamp]);

  const startMeditation = useCallback(() => {
    // Auto-start audio if not playing, with volume ramp
    if (audioRef.current && !isPlaying) {
      audioRef.current.volume = 0;
      audioRef.current.play();
      setIsPlaying(true);
      rampVolumeUp();
    }

    setIsMeditating(true);
    setMeditationProgress(0);
    meditationStartRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - meditationStartRef.current;
      const progress = Math.min(elapsed / MEDITATION_DURATION, 1);
      setMeditationProgress(progress);

      if (progress < 1) {
        meditationTimerRef.current = requestAnimationFrame(tick);
      } else {
        // Meditation complete
        setIsMeditating(false);
        setMeditationProgress(0);
        meditationTimerRef.current = null;
      }
    };

    meditationTimerRef.current = requestAnimationFrame(tick);
  }, [isPlaying, rampVolumeUp]);

  const toggleMeditation = useCallback(() => {
    if (isMeditating) {
      endMeditation();
    } else {
      startMeditation();
    }
  }, [isMeditating, endMeditation, startMeditation]);

  // Suck-in / blow-out hero content when meditation state changes
  useEffect(() => {
    const content = document.getElementById("hero-content");
    const scroll = document.getElementById("hero-scroll-indicator");
    const pill = containerRef.current;
    const targets = [content, scroll].filter(Boolean) as HTMLElement[];

    if (!pill || targets.length === 0) return;

    const wasJustMeditating = prevMeditatingRef.current && !isMeditating;
    prevMeditatingRef.current = isMeditating;

    const pillRect = pill.getBoundingClientRect();
    const pillCenterX = pillRect.left + pillRect.width / 2;
    const pillCenterY = pillRect.top + pillRect.height / 2;

    if (isMeditating) {
      // --- SUCK IN ---
      for (const el of targets) {
        const elRect = el.getBoundingClientRect();
        const elCenterX = elRect.left + elRect.width / 2;
        const elCenterY = elRect.top + elRect.height / 2;
        const dx = pillCenterX - elCenterX;
        const dy = pillCenterY - elCenterY;

        el.style.transition =
          "transform 0.7s cubic-bezier(0.5, 0, 0.75, 0), opacity 0.7s cubic-bezier(0.5, 0, 0.75, 0)";
        el.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      }
    } else if (wasJustMeditating) {
      // --- BLOW OUT ---
      for (const el of targets) {
        const elRect = el.getBoundingClientRect();
        const elCenterX = elRect.left + elRect.width / 2;
        const elCenterY = elRect.top + elRect.height / 2;
        const dx = pillCenterX - elCenterX;
        const dy = pillCenterY - elCenterY;

        // Snap to pill position instantly (no transition)
        el.style.transition = "none";
        el.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
        el.style.opacity = "0";

        // Next frame: animate outward
        requestAnimationFrame(() => {
          el.style.transition =
            "transform 0.7s cubic-bezier(0.2, 1, 0.3, 1), opacity 0.5s ease-out";
          el.style.transform = "translate(0, 0) scale(1)";
          el.style.opacity = "1";
          el.style.pointerEvents = "";
        });
      }
    }

    return () => {
      for (const el of targets) {
        el.style.transition = "";
        el.style.transform = "";
        el.style.opacity = "1";
        el.style.pointerEvents = "";
      }
    };
  }, [isMeditating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (meditationTimerRef.current !== null) {
        cancelAnimationFrame(meditationTimerRef.current);
      }
      if (volumeRampRef.current !== null) {
        cancelAnimationFrame(volumeRampRef.current);
      }
      // Restore hero content visibility on unmount
      const content = document.getElementById("hero-content");
      const scroll = document.getElementById("hero-scroll-indicator");
      for (const el of [content, scroll]) {
        if (el) {
          el.style.transition = "";
          el.style.transform = "";
          el.style.opacity = "1";
          el.style.pointerEvents = "";
        }
      }
    };
  }, []);

  const secondsRemaining = Math.ceil(
    (MEDITATION_DURATION / 1000) * (1 - meditationProgress)
  );

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient-stream.mp3" preload="auto" />

      {/* Pill container */}
      <div
        ref={containerRef}
        className={cn(
          "fixed bottom-6 right-6 flex flex-col items-end gap-2",
          isMeditating ? "z-[70]" : "z-50"
        )}
      >
        {/* Meditation verse — small text above pill */}
        <AnimatePresence>
          {isMeditating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.6 }}
              className="max-w-[260px] text-right pointer-events-none"
            >
              <blockquote
                className="text-sm leading-relaxed text-white/80"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                }}
              >
                &ldquo;A&nbsp;false balance is abomination to the Lord:
                but a&nbsp;just weight is his delight.&rdquo;
              </blockquote>
              <cite
                className="mt-1 block text-xs text-white/50 not-italic"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }}
              >
                — Proverbs 11:1 &middot; {secondsRemaining}s
              </cite>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pill button */}
        <div className="relative">
          {isMeditating && <CountdownRing progress={meditationProgress} />}
          <div className="flex h-12 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg overflow-hidden"
               style={{ width: PILL_W }}>
            {/* Left half — audio toggle */}
            <motion.button
              onClick={toggleAudio}
              className="flex h-full items-center justify-center"
              style={{ width: PILL_W / 2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={
                isPlaying ? "Mute ambient sound" : "Play ambient sound"
              }
            >
              {isPlaying ? (
                <Volume2 className="h-5 w-5 text-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
            </motion.button>

            {/* Divider */}
            <div className="w-px self-stretch my-2 bg-border" />

            {/* Right half — meditation toggle */}
            <motion.button
              onClick={toggleMeditation}
              onMouseEnter={() => !isMeditating && setShowMeditationHint(true)}
              onMouseLeave={() => setShowMeditationHint(false)}
              className="flex h-full items-center justify-center"
              style={{ width: PILL_W / 2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={
                isMeditating ? "End meditation" : "Start 30-second meditation"
              }
            >
              <Flower2
                className={cn(
                  "h-5 w-5",
                  isMeditating ? "text-primary" : "text-muted-foreground"
                )}
              />
            </motion.button>
          </div>

          {/* Meditation hover hint */}
          <AnimatePresence>
            {showMeditationHint && !isMeditating && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-12 right-0 whitespace-nowrap rounded-md bg-background/90 backdrop-blur-md border border-border px-3 py-1.5 text-xs text-muted-foreground shadow-lg pointer-events-none"
              >
                Take a breath. Meditate for 30 seconds.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default AmbientAudio;
