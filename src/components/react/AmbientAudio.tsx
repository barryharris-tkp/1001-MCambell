import { useState, useRef, useEffect, useCallback } from "react";
import { Volume, Volume1, Volume2, VolumeX, Flower2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const MEDITATION_DURATION = 60_000;

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
  const [volume, setVolume] = useState(30);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showMeditationHint, setShowMeditationHint] = useState(false);
  const [isMeditating, setIsMeditating] = useState(false);
  const [meditationProgress, setMeditationProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const meditationTimerRef = useRef<number | null>(null);
  const meditationStartRef = useRef<number>(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

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

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const getVolumeIcon = () => {
    if (!isPlaying || volume === 0) {
      return <VolumeX className="h-5 w-5 text-muted-foreground" />;
    } else if (volume <= 33) {
      return <Volume className="h-5 w-5 text-primary" />;
    } else if (volume <= 66) {
      return <Volume1 className="h-5 w-5 text-primary" />;
    } else {
      return <Volume2 className="h-5 w-5 text-primary" />;
    }
  };

  const endMeditation = useCallback(() => {
    setIsMeditating(false);
    setMeditationProgress(0);
    if (meditationTimerRef.current !== null) {
      cancelAnimationFrame(meditationTimerRef.current);
      meditationTimerRef.current = null;
    }
  }, []);

  const startMeditation = useCallback(() => {
    // Auto-start audio if not playing
    if (audioRef.current && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
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
  }, [isPlaying]);

  const toggleMeditation = useCallback(() => {
    if (isMeditating) {
      endMeditation();
    } else {
      startMeditation();
    }
  }, [isMeditating, endMeditation, startMeditation]);

  // Hide/show hero content when meditation state changes
  useEffect(() => {
    const content = document.getElementById("hero-content");
    const scroll = document.getElementById("hero-scroll-indicator");
    const targets = [content, scroll].filter(Boolean) as HTMLElement[];

    for (const el of targets) {
      el.style.transition = "opacity 0.6s ease";
      el.style.opacity = isMeditating ? "0" : "1";
      el.style.pointerEvents = isMeditating ? "none" : "";
    }

    return () => {
      for (const el of targets) {
        el.style.transition = "";
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
      // Restore hero content visibility on unmount
      const content = document.getElementById("hero-content");
      const scroll = document.getElementById("hero-scroll-indicator");
      for (const el of [content, scroll]) {
        if (el) {
          el.style.transition = "";
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
        className={cn(
          "fixed bottom-6 right-6 flex flex-col items-end gap-2",
          isMeditating ? "z-[70]" : "z-50"
        )}
        onMouseEnter={() => isPlaying && setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
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

        {/* Volume slider — aligned above the left (audio) half */}
        <AnimatePresence>
          {showVolumeSlider && isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="mr-[52px] glass-card rounded-full px-3 py-4 flex flex-col items-center"
            >
              <Slider
                orientation="vertical"
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="h-24"
              />
              <span className="text-xs text-muted-foreground mt-2">
                {volume}%
              </span>
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
              {getVolumeIcon()}
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
                isMeditating ? "End meditation" : "Start 1-minute meditation"
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
                Take a breath. Meditate for one minute.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default AmbientAudio;
