import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAliens, useSimilarity } from "@/hooks/useAliens";
import { AlienCard } from "@/components/AlienCard";
import { OmnitrixLoader } from "@/components/OmnitrixLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Similarity = () => {
  const [searchParams] = useSearchParams();
  const initialAlienId = searchParams.get("alienId") || "";
  const showOpposite = searchParams.get("opposite") === "true";

  const [selectedAlienId, setSelectedAlienId] = useState(initialAlienId);
  const [metric, setMetric] = useState<string>("cosine");

  const { data: aliens, isLoading: aliensLoading } = useAliens();
  const { data: similarityResults, isLoading: similarityLoading } = useSimilarity(
    selectedAlienId,
    metric
  );

  useEffect(() => {
    if (initialAlienId) {
      setSelectedAlienId(initialAlienId);
    }
  }, [initialAlienId]);

  const selectedAlien = aliens?.find((a) => a.id === selectedAlienId);
  const topSimilar = similarityResults?.similar || [];
  const mostDissimilar = similarityResults?.opposite;

  if (aliensLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <OmnitrixLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-primary text-glow mb-4">
            SIMILARITY EXPLORER
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover aliens with similar or contrasting capabilities
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="holo-card p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="font-orbitron text-xs sm:text-sm">SELECT ALIEN</Label>
              <Select value={selectedAlienId} onValueChange={setSelectedAlienId}>
                <SelectTrigger className="bg-muted border-primary/30 font-orbitron text-sm">
                  <SelectValue placeholder="Choose an alien..." />
                </SelectTrigger>
                <SelectContent>
                  {aliens?.map((alien) => (
                    <SelectItem key={alien.id} value={alien.id}>
                      {alien.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-orbitron text-xs sm:text-sm">SIMILARITY METRIC</Label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger className="bg-muted border-primary/30 font-orbitron text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cosine">Cosine</SelectItem>
                  <SelectItem value="euclidean">Euclidean</SelectItem>
                  <SelectItem value="manhattan">Manhattan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {selectedAlienId && (
          <div className="space-y-12">
            {/* Selected Alien */}
            {selectedAlien && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h2 className="font-orbitron text-lg text-muted-foreground mb-4">
                  ANALYZING
                </h2>
                <div className="max-w-xs mx-auto">
                  <AlienCard alien={selectedAlien} />
                </div>
              </motion.div>
            )}

            {similarityLoading ? (
              <div className="flex justify-center py-12">
                <OmnitrixLoader />
              </div>
            ) : (
              <>
                {/* Most Similar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="font-orbitron text-base sm:text-lg text-primary mb-4 sm:mb-6 text-center">
                    TOP 3 SIMILAR ALIENS
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                    {topSimilar.map((result, index) => (
                      <motion.div
                        key={result.alien.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="max-w-xs mx-auto w-full sm:max-w-none"
                      >
                        <AlienCard
                          alien={result.alien}
                          similarity={result.similarity}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Most Dissimilar */}
                {mostDissimilar && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <h2 className="font-orbitron text-lg text-accent mb-6">
                      MOST OPPOSITE ALIEN
                    </h2>
                    <div className="max-w-xs mx-auto">
                      <AlienCard
                        alien={mostDissimilar.alien}
                        similarity={mostDissimilar.similarity}
                      />
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        )}

        {!selectedAlienId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground font-orbitron">
              Select an alien to begin similarity analysis
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
