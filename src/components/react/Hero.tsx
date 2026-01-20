import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Load and play video in background - non-blocking with seamless loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start playing when enough data is buffered
    const handleCanPlayThrough = () => {
      setIsVideoReady(true);
      video.play().catch(() => {
        video.muted = true;
        video.play();
      });
    };

    // Seamless loop: reset video before it visibly ends to avoid glitch
    const handleTimeUpdate = () => {
      // Reset 0.1 seconds before end to create seamless loop
      if (video.duration && video.currentTime >= video.duration - 0.1) {
        video.currentTime = 0;
      }
    };

    // Handle visibility change - resume when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused && isVideoReady) {
        video.play();
      }
    };

    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("timeupdate", handleTimeUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start loading the video
    video.load();

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isVideoReady]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  // Zoom-in from far away animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut" as const
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.4 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.4,
        ease: "easeOut" as const
      }
    }
  };

  const title1 = "Tax & Accounting";
  const title2 = "You Can Trust";

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a1612]"
    >
      {/* Static poster image - shows immediately */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ scale: videoScale }}
      >
        <img
          src="/videos/hero-poster.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: isVideoReady ? 0 : 1, transition: 'opacity 0.8s ease-out' }}
        />
      </motion.div>

      {/* Video background - fades in when ready */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ scale: videoScale, opacity: videoOpacity }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: isVideoReady ? 1 : 0 }}
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Content with parallax */}
      <motion.div
        className="relative z-10 container mx-auto px-4 text-center"
        style={{ y: contentY }}
      >
        {/* Content directly on background */}
        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.p
            className="text-accent text-base md:text-lg lg:text-xl tracking-[0.3em] uppercase mb-8 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            variants={itemVariants}
          >
            Professional Excellence Since 1980
          </motion.p>

          {/* Animated title - line 1 with enhanced hover */}
          <motion.h1
            className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 leading-relaxed cursor-default py-2"
            variants={titleVariants}
            style={{ perspective: 1000 }}
          >
            <motion.span
              className="inline-block"
              whileHover={{
                scale: 1.08,
                y: -5,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {title1}
            </motion.span>
          </motion.h1>

          {/* Animated title - line 2 with accent and enhanced hover */}
          <motion.h1
            className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight cursor-default"
            variants={titleVariants}
            style={{ perspective: 1000 }}
          >
            <motion.span
              className="inline-block text-accent"
              whileHover={{
                scale: 1.1,
                y: -8,
                rotate: -2,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {title2}
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-white text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Expert CPA services for individuals and businesses.
            <br className="hidden md:block" />
            45+ years of dedicated professional experience.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                variant="accent"
                className="text-lg px-10 py-7 shadow-2xl shadow-accent/25 relative overflow-hidden group"
              >
                <a href="/contact">
                  <span className="relative z-10 flex items-center">
                    Schedule Consultation
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </a>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="text-lg px-10 py-7 glass-button relative overflow-hidden group"
              >
                <a href="/services">
                  <span className="relative z-10">View Services</span>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced scroll indicator */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors cursor-pointer group"
        aria-label="Scroll to content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore
          </span>
          <div className="relative">
            <ChevronDown className="w-7 h-7" />
            <motion.div
              className="absolute inset-0 rounded-full bg-white/10"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.button>

    </section>
  );
};

export default Hero;
