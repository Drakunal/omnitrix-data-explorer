import { motion } from "framer-motion";
import type { Alien } from "@/types/alien";

interface RadarChartProps {
  alien: Alien;
  size?: number;
}

export const RadarChart = ({ alien, size = 250 }: RadarChartProps) => {
  const stats = [
    { key: "strength", label: "STR", value: alien.strength },
    { key: "speed", label: "SPD", value: alien.speed },
    { key: "intelligence", label: "INT", value: alien.intelligence },
    { key: "durability", label: "DUR", value: alien.durability },
    { key: "power", label: "PWR", value: alien.power },
    { key: "combat", label: "CMB", value: alien.combat },
  ];

  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = (2 * Math.PI) / stats.length;

  // Generate polygon points for the data
  const dataPoints = stats.map((stat, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const value = stat.value / 100;
    return {
      x: center + Math.cos(angle) * radius * value,
      y: center + Math.sin(angle) * radius * value,
    };
  });

  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Generate grid lines
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Background grid circles */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={stats
            .map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              return `${center + Math.cos(angle) * radius * level},${center + Math.sin(angle) * radius * level}`;
            })
            .join(" ")}
          fill="none"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {stats.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + Math.cos(angle) * radius}
            y2={center + Math.sin(angle) * radius}
            stroke="hsl(var(--primary) / 0.3)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <motion.path
        d={dataPath}
        fill="hsl(var(--primary) / 0.2)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Data points */}
      {dataPoints.map((point, i) => (
        <motion.circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 * i }}
        />
      ))}

      {/* Labels */}
      {stats.map((stat, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 25;
        return (
          <g key={stat.key}>
            <text
              x={center + Math.cos(angle) * labelRadius}
              y={center + Math.sin(angle) * labelRadius}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-primary text-xs font-orbitron font-bold"
            >
              {stat.label}
            </text>
            <text
              x={center + Math.cos(angle) * (labelRadius + 15)}
              y={center + Math.sin(angle) * (labelRadius + 15)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {stat.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
