import { useState } from "react";
import { motion } from "framer-motion";
import type { ProjectionPoint } from "@/types/alien";

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

export const ScatterPlot = ({ points, width = 600, height = 400 }: ScatterPlotProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

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
          const isHovered = hoveredPoint === point.id;

          return (
            <motion.g
              key={point.id}
              onMouseEnter={() => setHoveredPoint(point.id)}
              onMouseLeave={() => setHoveredPoint(null)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow effect */}
              <motion.circle
                cx={x}
                cy={y}
                r={isHovered ? 20 : 12}
                fill={color}
                opacity={0.2}
                animate={{ r: isHovered ? 20 : 12 }}
              />
              
              {/* Main point */}
              <motion.circle
                cx={x}
                cy={y}
                r={8}
                fill={color}
                stroke="hsl(var(--background))"
                strokeWidth="2"
                className="cursor-pointer"
                animate={{ scale: isHovered ? 1.3 : 1 }}
              />

              {/* Label on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={x + 12}
                    y={y - 20}
                    width={point.name.length * 8 + 16}
                    height={24}
                    rx="4"
                    fill="hsl(var(--card))"
                    stroke={color}
                    strokeWidth="1"
                  />
                  <text
                    x={x + 20}
                    y={y - 4}
                    className="fill-foreground text-xs font-orbitron"
                  >
                    {point.name}
                  </text>
                </g>
              )}
            </motion.g>
          );
        })}
      </svg>

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
