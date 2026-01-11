import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { OmnitrixLoader } from "@/components/OmnitrixLoader";
import { Button } from "@/components/ui/button";
import { ChevronRight, Database, Brain, Layers } from "lucide-react";

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Database,
      title: "Alien Database",
      description: "Explore detailed profiles of every alien in the Omnitrix",
    },
    {
      icon: Brain,
      title: "Similarity Analysis",
      description: "Discover aliens with similar or opposite capabilities",
    },
    {
      icon: Layers,
      title: "Clustering Lab",
      description: "Group aliens by their shared characteristics",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 hex-pattern">
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
            {/* Main title */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <motion.div
                  className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary shadow-glow"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-6 h-6 bg-primary rounded-sm rotate-45" />
                </motion.div>
              </div>
              
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
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-12"
            >
              Explore the hidden structure of the Ben 10 alien universe through
              data science and machine learning
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
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
