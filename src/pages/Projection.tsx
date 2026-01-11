import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useReduce } from "@/hooks/useAliens";
import { ScatterPlot } from "@/components/ScatterPlot";
import { OmnitrixLoader } from "@/components/OmnitrixLoader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScatterChart } from "lucide-react";

const availableFeatures = [
  { id: "strength", label: "Strength" },
  { id: "speed", label: "Speed" },
  { id: "intelligence", label: "Intelligence" },
  { id: "durability", label: "Durability" },
];

export const Projection = () => {
  const [method, setMethod] = useState<"pca" | "umap">("pca");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "strength",
    "speed",
    "intelligence",
    "durability",
  ]);

  const reduceMutation = useReduce();

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

  // Run initial projection
  useEffect(() => {
    runProjection();
  }, []);

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
              <div className="flex flex-wrap gap-4 pt-1">
                {availableFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`proj-${feature.id}`}
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={() => handleFeatureToggle(feature.id)}
                    />
                    <label
                      htmlFor={`proj-${feature.id}`}
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {feature.label}
                    </label>
                  </div>
                ))}
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
          ) : reduceMutation.data ? (
            <div className="flex justify-center">
              <ScatterPlot
                points={reduceMutation.data}
                width={Math.min(700, window.innerWidth - 80)}
                height={450}
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
            <span className="text-primary font-orbitron">TIP:</span> Hover over points to see alien names.
            Points are colored by their cluster assignment.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
