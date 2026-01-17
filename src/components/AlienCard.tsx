import { motion } from "framer-motion";
import type { Alien } from "@/types/alien";

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

export const AlienCard = ({ alien, onClick, clusterIndex, similarity }: AlienCardProps) => {
  const clusterStyle = clusterIndex !== undefined ? clusterColors[clusterIndex % clusterColors.length] : "";
  
  return (
    <motion.div
      className={`holo-card cursor-pointer group ${clusterIndex !== undefined ? clusterStyle : "hover:shadow-glow"}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image container with hexagonal clip */}
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
      <div className="p-3 sm:p-4">
        <h3 className="font-orbitron font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors tracking-wider truncate">
          {alien.name}
        </h3>
        {alien.species && (
          <p className="text-muted-foreground text-xs sm:text-sm mt-1 font-mono truncate">
            {alien.species}
          </p>
        )}
        
        {/* Mini stats */}
        <div className="mt-2 sm:mt-3 grid grid-cols-4 gap-1">
          {[
            { label: "STR", value: alien.strength },
            { label: "SPD", value: alien.speed },
            { label: "INT", value: alien.intelligence },
            { label: "DUR", value: alien.durability },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground">{label}</div>
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
      </div>
    </motion.div>
  );
};
