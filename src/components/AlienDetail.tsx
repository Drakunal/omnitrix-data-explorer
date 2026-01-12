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
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-3xl max-h-[90vh] bg-card border border-primary/30 rounded-xl overflow-auto z-[60] shadow-glow"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-primary/20 p-4 flex items-center justify-between">
          <h2 className="font-orbitron font-bold text-xl text-primary">
            {alien.name}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden border border-primary/30">
              <img
                src={alien.image}
                alt={alien.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>
            
            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-primary" />
            <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-primary" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-primary" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-primary" />

            {/* Species tag */}
            {alien.species && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-card/90 backdrop-blur-sm border border-primary/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Species
                  </p>
                  <p className="font-orbitron text-foreground">
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
        <div className="p-6 border-t border-primary/20 flex flex-wrap gap-4">
          <Button
            variant="omnitrix"
            onClick={() => {
              onClose();
              navigate(`/similarity?alienId=${alien.id}`);
            }}
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
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Find Opposite Alien
          </Button>
        </div>
      </motion.div>
    </>
  );
};
