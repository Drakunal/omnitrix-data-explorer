import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useReduce } from "@/hooks/useAliens";
import { ScatterPlot } from "@/components/ScatterPlot";
import { OmnitrixLoader } from "@/components/OmnitrixLoader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScatterChart } from "lucide-react";
import type { ProjectionPoint } from "@/types/alien";

const CACHE_KEY = "projection_cache";

const availableFeatures = [
  { id: "strength", label: "Strength" },
  { id: "speed", label: "Speed" },
  { id: "intelligence", label: "Intelligence" },
  { id: "durability", label: "Durability" },
  { id: "power", label: "Power" },
  { id: "combat", label: "Combat" },
];

export const Projection = () => {
  const [method, setMethod] = useState<"pca" | "umap">("pca");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "strength",
    "speed",
    "intelligence",
    "durability",
    "power",
    "combat",
  ]);
  const [cachedData, setCachedData] = useState<ProjectionPoint[] | null>(null);

  const reduceMutation = useReduce();

  // Load cached data on mount
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setCachedData(JSON.parse(cached));
      } catch (e) {
        localStorage.removeItem(CACHE_KEY);
      }
    }
  }, []);

  // Save to cache when new data arrives
  useEffect(() => {
    if (reduceMutation.data) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(reduceMutation.data));
      setCachedData(reduceMutation.data);
    }
  }, [reduceMutation.data]);

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((f) => f !== featureId)
        : [...prev, featureId]
    );
  };

  const runProjection = () => {
    if (selectedFeatures.length < 2) return;
    reduceMutation.mutate({
      method,
      features: selectedFeatures,
    });
  };

  const displayData = reduceMutation.data || cachedData;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-primary text-glow mb-4">
            2D PROJECTION VIEW
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Visualize alien relationships in reduced dimensional space
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="holo-card p-6 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Method */}
            <div className="space-y-2">
              <Label className="font-orbitron text-sm">METHOD</Label>
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as "pca" | "umap")}
              >
                <SelectTrigger className="bg-muted border-primary/30 font-orbitron">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pca">PCA</SelectItem>
                  <SelectItem value="umap">UMAP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Features */}
            <div className="space-y-2 md:col-span-2">
              <Label className="font-orbitron text-sm">FEATURES</Label>
              <div className="flex flex-wrap gap-3 pt-1">
                {availableFeatures.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFeatureToggle(feature.id);
                      }}
                      className="flex items-center gap-2 cursor-pointer select-none group bg-transparent border-none p-0"
                    >
                      <div
                        className={`h-5 w-5 shrink-0 rounded border-2 transition-all flex items-center justify-center pointer-events-none ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-primary/50 bg-card group-hover:border-primary"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors pointer-events-none">
                        {feature.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              variant="omnitrix"
              onClick={runProjection}
              disabled={selectedFeatures.length < 2 || reduceMutation.isPending}
              type="button"
            >
              <ScatterChart className="w-4 h-4 mr-2" />
              Generate Projection
            </Button>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="holo-card p-6"
        >
          {reduceMutation.isPending ? (
            <div className="flex justify-center py-12">
              <OmnitrixLoader />
            </div>
          ) : displayData ? (
            <div className="flex justify-center overflow-x-auto">
              <ScatterPlot
                points={displayData}
                width={Math.min(700, typeof window !== 'undefined' ? window.innerWidth - 48 : 700)}
                height={Math.min(450, typeof window !== 'undefined' ? window.innerWidth - 48 : 450)}
              />
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-orbitron">
                Configure parameters and generate projection
              </p>
            </div>
          )}
        </motion.div>

        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-orbitron">TIP:</span> Click on points to pin alien details.
            Hover over points to preview. Points are colored by cluster.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
