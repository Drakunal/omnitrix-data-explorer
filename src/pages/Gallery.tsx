import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAliens } from "@/hooks/useAliens";
import { AlienCard } from "@/components/AlienCard";
import { AlienDetail } from "@/components/AlienDetail";
import { OmnitrixLoader } from "@/components/OmnitrixLoader";
import type { Alien } from "@/types/alien";

export const Gallery = () => {
  const { data: aliens, isLoading, error } = useAliens();
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <OmnitrixLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-destructive font-orbitron mb-4">
            ERROR LOADING ALIEN DATABASE
          </p>
          <p className="text-muted-foreground">
            Unable to connect to Omnitrix systems
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-primary text-glow mb-4">
            ALIEN GALLERY
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Select an alien to view detailed analysis and explore similarities
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {aliens?.map((alien, index) => (
            <motion.div
              key={alien.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AlienCard
                alien={alien}
                onClick={() => setSelectedAlien(alien)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedAlien && (
            <AlienDetail
              alien={selectedAlien}
              onClose={() => setSelectedAlien(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
