import { motion } from "framer-motion";

export const OmnitrixLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Middle ring - spinning */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-primary"
          style={{
            borderTopColor: "transparent",
            borderRightColor: "transparent",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Inner ring - counter spinning */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-accent"
          style={{
            borderBottomColor: "transparent",
            borderLeftColor: "transparent",
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Center hexagon */}
        <motion.div
          className="absolute inset-8 bg-primary/20 rounded-full flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 20px hsl(var(--primary) / 0.3)",
              "0 0 40px hsl(var(--primary) / 0.6)",
              "0 0 20px hsl(var(--primary) / 0.3)",
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-4 h-4 bg-primary rounded-sm rotate-45" />
        </motion.div>
      </div>
      
      <motion.p
        className="text-primary font-orbitron text-sm tracking-widest"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        INITIALIZING OMNITRIX...
      </motion.p>
    </div>
  );
};
