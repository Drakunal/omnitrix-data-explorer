import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Alien } from "@/types/alien";

interface AlienDetailResponse {
  id: string;
  name: string;
  original_name: string;
  image_url: string;
  stats: {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
  };
  super_powers: string[];
}

interface AlienCardProps {
  alien: Alien;
  onClick?: () => void;
  clusterIndex?: number;
  similarity?: number;
}

const clusterColors = [
  "border-cluster-1 shadow-[0_0_20px_hsl(var(--cluster-1)/0.5)]",
  "border-cluster-2 shadow-[0_0_20px_hsl(var(--cluster-2)/0.5)]",
  "border-cluster-3 shadow-[0_0_20px_hsl(var(--cluster-3)/0.5)]",
  "border-cluster-4 shadow-[0_0_20px_hsl(var(--cluster-4)/0.5)]",
  "border-cluster-5 shadow-[0_0_20px_hsl(var(--cluster-5)/0.5)]",
];

const API_BASE = "http://localhost:8000";

export const AlienCard = ({ alien, onClick, clusterIndex, similarity }: AlienCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [alienDetail, setAlienDetail] = useState<AlienDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const clusterStyle = clusterIndex !== undefined ? clusterColors[clusterIndex % clusterColors.length] : "";

  const handleFlip = async () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setIsLoading(true);
      
      try {
        const response = await fetch(`${API_BASE}/aliens/${alien.id}`, {
          headers: { Accept: "application/json" },
        });
        
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const data: AlienDetailResponse = await response.json();
        console.log(`✅ [API] Alien detail received:`, data);
        setAlienDetail(data);
      } catch (error) {
        console.warn(`⚠️ [API] Failed to fetch alien detail:`, error);
        // Fallback to basic data
        setAlienDetail({
          id: alien.id,
          name: alien.name,
          original_name: alien.species || "",
          image_url: alien.image,
          stats: {
            strength: alien.strength,
            speed: alien.speed,
            intelligence: alien.intelligence,
            durability: alien.durability,
            power: alien.power,
            combat: alien.combat,
          },
          super_powers: [],
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsFlipped(false);
    }
  };

  return (
    <div 
      className="perspective-1000"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Front of card */}
        <motion.div
          className={`holo-card cursor-pointer group ${clusterIndex !== undefined ? clusterStyle : "hover:shadow-glow"}`}
          style={{ backfaceVisibility: "hidden" }}
          onClick={handleFlip}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <img
              src={alien.image}
              alt={alien.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Scan line overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50 group-hover:border-primary transition-colors" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50 group-hover:border-primary transition-colors" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/50 group-hover:border-primary transition-colors" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50 group-hover:border-primary transition-colors" />
            
            {/* Similarity badge */}
            {similarity !== undefined && (
              <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-2 py-1 rounded font-orbitron text-xs z-20">
                {Math.round(similarity * 100)}%
              </div>
            )}
          </div>
          
          {/* Info section */}
          <div className="p-4">
            <h3 className="font-orbitron font-bold text-lg text-foreground group-hover:text-primary transition-colors tracking-wider">
              {alien.name}
            </h3>
            {alien.species && (
              <p className="text-muted-foreground text-sm mt-1 font-mono">
                {alien.species}
              </p>
            )}
            
            {/* Mini stats */}
            <div className="mt-3 grid grid-cols-4 gap-1">
              {[
                { label: "STR", value: alien.strength },
                { label: "SPD", value: alien.speed },
                { label: "INT", value: alien.intelligence },
                { label: "DUR", value: alien.durability },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-[10px] text-muted-foreground">{label}</div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden mt-1">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* See full details hint */}
            <div className="mt-3 text-center">
              <span className="text-xs text-primary/70 font-orbitron group-hover:text-primary transition-colors">
                [ CLICK FOR FULL DETAILS ]
              </span>
            </div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className={`holo-card absolute inset-0 cursor-pointer overflow-hidden ${clusterIndex !== undefined ? clusterStyle : "shadow-glow"}`}
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={handleFlip}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : alienDetail ? (
            <div className="p-4 h-full overflow-y-auto max-h-[400px]">
              {/* Header with image */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={alienDetail.image_url}
                  alt={alienDetail.name}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-primary/50"
                />
                <div>
                  <h3 className="font-orbitron font-bold text-lg text-primary">
                    {alienDetail.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {alienDetail.original_name}
                  </p>
                </div>
              </div>

              {/* All Stats */}
              <div className="space-y-2 mb-4">
                <p className="text-xs text-muted-foreground font-orbitron mb-2">STATS</p>
                {[
                  { label: "STR", value: alienDetail.stats.strength },
                  { label: "SPD", value: alienDetail.stats.speed },
                  { label: "INT", value: alienDetail.stats.intelligence },
                  { label: "DUR", value: alienDetail.stats.durability },
                  { label: "PWR", value: alienDetail.stats.power },
                  { label: "CMB", value: alienDetail.stats.combat },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-8">{label}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-foreground w-6 text-right">{value}</span>
                  </div>
                ))}
              </div>

              {/* Super Powers */}
              {alienDetail.super_powers.length > 0 && (
                <div className="border-t border-primary/20 pt-3">
                  <p className="text-xs text-muted-foreground font-orbitron mb-2">
                    POWERS ({alienDetail.super_powers.length})
                  </p>
                  <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto">
                    {alienDetail.super_powers.map((power, index) => (
                      <motion.span
                        key={power}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded"
                      >
                        {power}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Close hint */}
              <div className="mt-4 text-center border-t border-primary/20 pt-3">
                <span className="text-xs text-primary/70 font-orbitron">
                  [ CLICK TO FLIP BACK ]
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <p className="text-muted-foreground text-sm">Failed to load details</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
