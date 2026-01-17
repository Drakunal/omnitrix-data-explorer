import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Search, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadarChart } from "@/components/RadarChart";
import type { Alien } from "@/types/alien";

interface AlienDetailProps {
  alien: Alien;
  onClose: () => void;
}

export const AlienDetail = ({ alien, onClose }: AlienDetailProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-card border border-primary/30 rounded-xl overflow-auto shadow-glow mx-2 sm:mx-4"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-primary/20 p-3 sm:p-4 flex items-center justify-between">
          <h2 className="font-orbitron font-bold text-lg sm:text-xl text-primary truncate pr-2">
            {alien.name}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Image */}
          <div className="relative max-w-xs mx-auto md:max-w-none w-full">
            <div className="aspect-square rounded-lg overflow-hidden border border-primary/30">
              <img
                src={alien.image}
                alt={alien.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>
            
            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-4 sm:w-6 h-4 sm:h-6 border-l-2 border-t-2 border-primary" />
            <div className="absolute top-2 right-2 w-4 sm:w-6 h-4 sm:h-6 border-r-2 border-t-2 border-primary" />
            <div className="absolute bottom-2 left-2 w-4 sm:w-6 h-4 sm:h-6 border-l-2 border-b-2 border-primary" />
            <div className="absolute bottom-2 right-2 w-4 sm:w-6 h-4 sm:h-6 border-r-2 border-b-2 border-primary" />

            {/* Species tag */}
            {alien.species && (
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <div className="bg-card/90 backdrop-blur-sm border border-primary/30 rounded-lg p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                    Species
                  </p>
                  <p className="font-orbitron text-sm sm:text-base text-foreground">
                    {alien.species}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col">
            <h3 className="font-orbitron text-sm text-muted-foreground mb-4 tracking-wider">
              CAPABILITY ANALYSIS
            </h3>
            <RadarChart alien={alien} />

            {/* Stats bars */}
            <div className="mt-6 space-y-3">
              {[
                { label: "Strength", value: alien.strength },
                { label: "Speed", value: alien.speed },
                { label: "Intelligence", value: alien.intelligence },
                { label: "Durability", value: alien.durability },
                { label: "Power", value: alien.power },
                { label: "Combat", value: alien.combat },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-primary font-orbitron">{value}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-6 border-t border-primary/20 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant="omnitrix"
            onClick={() => {
              onClose();
              navigate(`/similarity?alienId=${alien.id}`);
            }}
            className="w-full sm:w-auto text-sm"
          >
            <Search className="w-4 h-4 mr-2" />
            Find Similar Aliens
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              navigate(`/similarity?alienId=${alien.id}&opposite=true`);
            }}
            className="w-full sm:w-auto text-sm"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Find Opposite Alien
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
