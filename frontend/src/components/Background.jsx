import { motion } from "framer-motion";

const Background = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/20" />
      
      {/* Static gradient overlay */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-cyan-400/10" />

      {/* Simplified grid */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        {/* Horizontal lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent dark:via-gray-600"
            style={{ top: `${i * 5}%` }}
          />
        ))}
        
        {/* Vertical lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gray-400 to-transparent dark:via-gray-600"
            style={{ left: `${i * 5}%` }}
          />
        ))}
      </div>

      {/* Optimized floating nodes - fewer and simpler */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-50 dark:opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle pulsing center orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-500/10 dark:from-blue-400/5 dark:to-purple-500/5 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Simple corner accents */}
      <motion.div
        className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-blue-400/30 dark:border-blue-400/20"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-purple-400/30 dark:border-purple-400/20"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 2,
          ease: "easeInOut",
        }}
      />

      {/* Subtle scanning beam - single */}
      <motion.div
        className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-400/20 to-transparent dark:via-blue-400/10"
        animate={{
          x: ["0%", "100%"],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Minimal floating circles - reduced quantity */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute border border-blue-300/10 dark:border-blue-400/5 rounded-full"
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Static glow effects */}
      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-blue-400/5 dark:bg-blue-400/3 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-400/5 dark:bg-purple-400/3 rounded-full blur-3xl" />
    </div>
  );
};

export default Background;