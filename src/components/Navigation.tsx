import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Grid3X3, Search, Layers, ScatterChart } from "lucide-react";
import omnitrixSymbol from "@/assets/omnitrix-symbol.png";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/gallery", label: "Gallery", icon: Grid3X3 },
  { path: "/similarity", label: "Similarity", icon: Search },
  { path: "/cluster", label: "Clustering", icon: Layers },
  { path: "/projection", label: "2D View", icon: ScatterChart },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              src={omnitrixSymbol}
              alt="Omnitrix"
              className="w-8 h-8 drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.3 }}
            />
            <span className="font-orbitron font-bold text-primary text-glow hidden sm:block">
              OMNITRIX LAB
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative"
                >
                  <motion.div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-orbitron text-xs sm:text-sm tracking-wider transition-colors ${
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </motion.div>
                  
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow"
                      layoutId="activeNav"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
