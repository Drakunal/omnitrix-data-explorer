import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCluster } from "@/hooks/useAliens";
import { AlienCard } from "@/components/AlienCard";
import { OmnitrixLoader } from "@/components/OmnitrixLoader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layers } from "lucide-react";

const availableFeatures = [
  { id: "strength", label: "Strength" },
  { id: "speed", label: "Speed" },
  { id: "intelligence", label: "Intelligence" },
  { id: "durability", label: "Durability" },
];

export const Cluster = () => {
  const [algorithm, setAlgorithm] = useState<"kmeans" | "hierarchical">("kmeans");
  const [k, setK] = useState(3);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "strength",
    "speed",
    "intelligence",
    "durability",
  ]);

  const clusterMutation = useCluster();

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((f) => f !== featureId)
        : [...prev, featureId]
    );
  };

  const runClustering = () => {
    if (selectedFeatures.length < 2) return;
    clusterMutation.mutate({
      algorithm,
      k,
      features: selectedFeatures,
    });
  };

  // Run initial clustering
  useEffect(() => {
    runClustering();
  }, []);

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
            CLUSTERING LAB
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Group aliens by their shared characteristics using machine learning
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="holo-card p-6 mb-8"
        >
          <div className="grid md:grid-cols-4 gap-6">
            {/* Algorithm */}
            <div className="space-y-2">
              <Label className="font-orbitron text-sm">ALGORITHM</Label>
              <Select
                value={algorithm}
                onValueChange={(v) => setAlgorithm(v as "kmeans" | "hierarchical")}
              >
                <SelectTrigger className="bg-muted border-primary/30 font-orbitron">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kmeans">K-Means</SelectItem>
                  <SelectItem value="hierarchical">Hierarchical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of clusters */}
            <div className="space-y-2">
              <Label className="font-orbitron text-sm">
                CLUSTERS: {k}
              </Label>
              <Slider
                value={[k]}
                onValueChange={([value]) => setK(value)}
                min={2}
                max={5}
                step={1}
                className="pt-2"
              />
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
              onClick={runClustering}
              disabled={selectedFeatures.length < 2 || clusterMutation.isPending}
              type="button"
            >
              <Layers className="w-4 h-4 mr-2" />
              Run Clustering
            </Button>
          </div>
        </motion.div>

        {/* Results */}
        {clusterMutation.isPending ? (
          <div className="flex justify-center py-12">
            <OmnitrixLoader />
          </div>
        ) : clusterMutation.data ? (
          <div className="space-y-12">
            {clusterMutation.data.map((cluster, clusterIndex) => (
              <motion.div
                key={cluster.cluster}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: clusterIndex * 0.1 }}
              >
                <h2 className="font-orbitron text-xl mb-6 flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full cluster-${clusterIndex}`}
                    style={{
                      backgroundColor: `hsl(var(--cluster-${clusterIndex + 1}))`,
                      boxShadow: `0 0 10px hsl(var(--cluster-${clusterIndex + 1}) / 0.5)`,
                    }}
                  />
                  Cluster {cluster.cluster + 1}
                  <span className="text-muted-foreground text-sm font-normal">
                    ({cluster.aliens.length} aliens)
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cluster.aliens.map((alien, alienIndex) => (
                    <motion.div
                      key={alien.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: clusterIndex * 0.1 + alienIndex * 0.05 }}
                    >
                      <AlienCard alien={alien} clusterIndex={clusterIndex} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground font-orbitron">
              Configure parameters and run clustering to see results
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
