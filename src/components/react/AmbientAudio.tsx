import { useState, useRef, useEffect } from "react";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";

const AmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient-stream.mp3" preload="auto" />
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2"
        onMouseEnter={() => isPlaying && setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        <AnimatePresence>
          {showVolumeSlider && isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-full px-3 py-4 flex flex-col items-center"
            >
              <Slider
                orientation="vertical"
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="h-24"
              />
              <span className="text-xs text-muted-foreground mt-2">{volume}%</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={toggleAudio}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg hover:bg-background transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
        >
          {getVolumeIcon()}
          {isPlaying && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
    </>
  );
};

export default AmbientAudio;
