import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { OmnitrixLoader } from "@/components/OmnitrixLoader";
import { Button } from "@/components/ui/button";
import { ChevronRight, Dna, Radar, Orbit } from "lucide-react";
import omnitrixSymbol from "@/assets/omnitrix-symbol.png";
import omnitrixInit from "@/assets/audio/omnitrix-init.mp3";

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for background music during loading
    audioRef.current = new Audio(omnitrixInit);
    audioRef.current.volume = 0.3;
    
    // Auto-play music on load
    audioRef.current.play().catch(() => {});
    
    const timer = setTimeout(() => setIsLoading(false), 2500);
    
    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const features = [
    {
      icon: Dna,
      title: "Alien Database",
      description: "Explore detailed profiles of every alien in the Omnitrix",
    },
    {
      icon: Radar,
      title: "Similarity Analysis",
      description: "Discover aliens with similar or opposite capabilities",
    },
    {
      icon: Orbit,
      title: "Clustering Lab",
      description: "Group aliens by their shared characteristics",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 hex-pattern relative">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <OmnitrixLoader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Omnitrix Symbol */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="mb-6 mt-16"
            >
              <div className="relative inline-block">
                <motion.img
                  src={omnitrixSymbol}
                  alt="Omnitrix Symbol"
                  className="w-32 h-32 sm:w-40 sm:h-40 mx-auto drop-shadow-[0_0_30px_hsl(var(--primary)/0.8)]"
                  animate={{
                    rotate: 360,
                    filter: [
                      "drop-shadow(0 0 20px hsl(var(--primary) / 0.5))",
                      "drop-shadow(0 0 40px hsl(var(--primary) / 0.8))",
                      "drop-shadow(0 0 20px hsl(var(--primary) / 0.5))",
                    ],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    filter: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
              </div>
            </motion.div>

            {/* Main title */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-orbitron font-black text-primary text-glow mb-4 tracking-wider">
                OMNITRIX
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold text-foreground tracking-widest">
                DATA LAB
              </h2>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-12"
            >
              Explore the hidden structure of the Ben 10 alien universe through
              data science and machine learning
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-16"
            >
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/gallery")}
                className="group"
              >
                Enter the Lab
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

            {/* Feature cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="holo-card p-6 text-left"
                >
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-orbitron font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full animate-pulse opacity-50" />
            <div className="absolute bottom-1/4 right-10 w-3 h-3 bg-accent rounded-full animate-pulse opacity-50" />
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-primary rounded-full animate-pulse opacity-30" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
