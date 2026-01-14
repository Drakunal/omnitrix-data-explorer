import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProjectionPoint } from "@/types/alien";

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

interface ScatterPlotProps {
  points: ProjectionPoint[];
  width?: number;
  height?: number;
}

const clusterColors = [
  "hsl(var(--cluster-1))",
  "hsl(var(--cluster-2))",
  "hsl(var(--cluster-3))",
  "hsl(var(--cluster-4))",
  "hsl(var(--cluster-5))",
];

const API_BASE = import.meta.env.VITE_API_BASE;

export const ScatterPlot = ({ points, width = 600, height = 400 }: ScatterPlotProps) => {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [alienDetail, setAlienDetail] = useState<AlienDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const padding = 40;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  // Normalize points to fit in the plot area
  const xValues = points.map((p) => p.x);
  const yValues = points.map((p) => p.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const normalize = (point: ProjectionPoint) => ({
    x: padding + ((point.x - xMin) / (xMax - xMin || 1)) * plotWidth,
    y: padding + ((yMax - point.y) / (yMax - yMin || 1)) * plotHeight,
  });

  const handlePointClick = async (pointId: string) => {
    if (selectedPoint === pointId) {
      setSelectedPoint(null);
      setAlienDetail(null);
      return;
    }

    setSelectedPoint(pointId);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/aliens/${pointId}`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data: AlienDetailResponse = await response.json();
      // console.log(`✅ [API] Alien detail received:`, data);
      setAlienDetail(data);
    } catch (error) {
      console.warn(`⚠️ [API] Failed to fetch alien detail:`, error);
      setAlienDetail(null);
    } finally {
      setIsLoading(false);
    }
  };

  const activePointData = selectedPoint ? points.find((p) => p.id === selectedPoint) : null;

  return (
    <div className="relative">
      <svg width={width} height={height} className="bg-card/50 rounded-lg border border-primary/20">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line
              x1={padding}
              y1={padding + t * plotHeight}
              x2={width - padding}
              y2={padding + t * plotHeight}
              stroke="hsl(var(--primary) / 0.1)"
              strokeWidth="1"
            />
            <line
              x1={padding + t * plotWidth}
              y1={padding}
              x2={padding + t * plotWidth}
              y2={height - padding}
              stroke="hsl(var(--primary) / 0.1)"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth="2"
        />

        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          className="fill-muted-foreground text-xs font-orbitron"
        >
          Component 1
        </text>
        <text
          x={15}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90, 15, ${height / 2})`}
          className="fill-muted-foreground text-xs font-orbitron"
        >
          Component 2
        </text>

        {/* Data points */}
        {points.map((point) => {
          const { x, y } = normalize(point);
          const color = point.cluster !== undefined ? clusterColors[point.cluster % clusterColors.length] : "hsl(var(--primary))";
          const isActive = selectedPoint === point.id || hoveredPoint === point.id;

          return (
            <motion.g
              key={point.id}
              onMouseEnter={() => setHoveredPoint(point.id)}
              onMouseLeave={() => setHoveredPoint(null)}
              onClick={() => handlePointClick(point.id)}
              style={{ cursor: "pointer" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow effect */}
              <motion.circle
                cx={x}
                cy={y}
                r={isActive ? 24 : 14}
                fill={color}
                opacity={0.2}
                animate={{ r: isActive ? 24 : 14 }}
              />
              
              {/* Main point */}
              <motion.circle
                cx={x}
                cy={y}
                r={10}
                fill={color}
                stroke="hsl(var(--background))"
                strokeWidth="2"
                animate={{ scale: isActive ? 1.4 : 1 }}
              />

              {/* Quick name label on hover */}
              {hoveredPoint === point.id && (
                <text
                  x={x}
                  y={y - 20}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-orbitron font-bold"
                  style={{ pointerEvents: "none" }}
                >
                  {point.display_name}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 w-72 bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-4 shadow-glow max-h-[400px] overflow-y-auto"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : alienDetail ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={alienDetail.image_url}
                    alt={alienDetail.name}
                    className="w-14 h-14 rounded-lg object-cover border border-primary/30"
                  />
                  <div>
                    <h4 className="font-orbitron font-bold text-primary">
                      {alienDetail.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {alienDetail.original_name}
                    </p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="space-y-2 mb-3">
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
                        />
                      </div>
                      <span className="text-xs text-foreground w-6 text-right">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Super Powers */}
                {alienDetail.super_powers.length > 0 && (
                  <div className="pt-2 border-t border-primary/20">
                    <p className="text-xs text-muted-foreground font-orbitron mb-2">POWERS</p>
                    <div className="flex flex-wrap gap-1">
                      {alienDetail.super_powers.slice(0, 8).map((power) => (
                        <span
                          key={power}
                          className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded"
                        >
                          {power}
                        </span>
                      ))}
                      {alienDetail.super_powers.length > 8 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">
                          +{alienDetail.super_powers.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Cluster info */}
                {activePointData?.cluster !== undefined && (
                  <div className="flex items-center gap-2 pt-2 mt-2 border-t border-primary/20">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: clusterColors[activePointData.cluster % clusterColors.length] }}
                    />
                    <span className="text-xs text-muted-foreground">
                      Cluster {activePointData.cluster + 1}
                    </span>
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-primary/10">
                  Click point again to close
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Failed to load alien data
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {Array.from(new Set(points.map((p) => p.cluster)))
          .filter((c) => c !== undefined)
          .map((cluster) => (
            <div key={cluster} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: clusterColors[cluster! % clusterColors.length] }}
              />
              <span className="text-xs text-muted-foreground font-orbitron">
                Cluster {cluster! + 1}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
