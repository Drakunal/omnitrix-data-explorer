import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAliens } from "@/hooks/useAliens";
import { AlienCard } from "@/components/AlienCard";
import { AlienDetail } from "@/components/AlienDetail";
import { OmnitrixLoader } from "@/components/OmnitrixLoader";
import type { Alien } from "@/types/alien";

const BATCH_SIZE = 12;

export const Gallery = () => {
  const { data: aliens, isLoading, error } = useAliens();
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const loaderRef = useRef<HTMLDivElement>(null);

  const visibleAliens = aliens?.slice(0, visibleCount) || [];
  const hasMore = aliens && visibleCount < aliens.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, aliens?.length || prev));
    }
  }, [hasMore, aliens?.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

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
          {aliens && (
            <p className="text-muted-foreground/60 text-sm mt-2">
              Showing {visibleAliens.length} of {aliens.length} aliens
            </p>
          )}
        </motion.div>

        {/* Grid - single column on mobile with max-width for cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {visibleAliens.map((alien, index) => (
            <motion.div
              key={alien.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % BATCH_SIZE) * 0.05 }}
              className="max-w-sm mx-auto w-full sm:max-w-none"
            >
              <AlienCard
                alien={alien}
                onClick={() => setSelectedAlien(alien)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Infinite scroll loader */}
        {hasMore && (
          <div
            ref={loaderRef}
            className="flex justify-center items-center py-8 mt-4"
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="font-orbitron text-sm">Loading more aliens...</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )}

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