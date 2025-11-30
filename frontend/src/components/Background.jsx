import { motion } from "framer-motion";

const Background = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/20" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-40 dark:opacity-30"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.05), rgba(6, 182, 212, 0.1))",
            "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.05), rgba(59, 130, 246, 0.1))",
            "linear-gradient(225deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.1))",
            "linear-gradient(315deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.05), rgba(6, 182, 212, 0.1))",
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Fast moving grid */}
      <div className="absolute inset-0">
        {/* Horizontal lines */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent dark:via-blue-400/15"
            style={{ top: `${i * 4}%` }}
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Vertical lines */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-400/30 to-transparent dark:via-purple-400/15"
            style={{ left: `${i * 4}%` }}
            animate={{
              opacity: [0, 0.6, 0],
              scaleY: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.1 + 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Energetic corner pulses */}
      <motion.div
        className="absolute top-6 left-6 w-20 h-20 border-t-2 border-l-2 border-blue-400/40 dark:border-blue-400/25"
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.3, 1],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-6 right-6 w-20 h-20 border-t-2 border-r-2 border-purple-400/40 dark:border-purple-400/25"
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.3, 1],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 0.7,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-6 left-6 w-20 h-20 border-b-2 border-l-2 border-cyan-400/40 dark:border-cyan-400/25"
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.3, 1],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1.4,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-6 right-6 w-20 h-20 border-b-2 border-r-2 border-pink-400/40 dark:border-pink-400/25"
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.3, 1],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 2.1,
          ease: "easeInOut",
        }}
      />

      {/* Active floating nodes */}
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-70 dark:opacity-50 shadow-md"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0, -20, 0],
            x: [0, 25, -25, 15, 0],
            scale: [1, 1.4, 0.7, 1.2, 1],
            opacity: [0.3, 0.9, 0.4, 0.8, 0.3],
            rotate: [0, 180, 360, 270, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Pulsing center orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-r from-blue-400/15 to-purple-500/15 dark:from-blue-400/10 dark:to-purple-500/10 blur-xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Fast scanning beams */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`beam-${i}`}
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-blue-400/25 to-transparent dark:via-blue-400/15"
          style={{
            left: `${20 * i}%`,
          }}
          animate={{
            x: [0, 120, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Energetic particles trail */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-70 dark:bg-cyan-300 dark:opacity-60"
          style={{
            left: `${8 + i * 10}%`,
            top: '85%',
          }}
          animate={{
            y: [0, -500, 0],
            x: [0, 60, -60, 30, 0],
            scale: [1, 2.5, 0.3, 1.8, 1],
            opacity: [0, 1, 0.3, 0.8, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Dynamic background pulses */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-transparent to-purple-400/10 dark:from-blue-400/5 dark:to-purple-400/5"
        animate={{
          opacity: [0.1, 0.4, 0.1],
          x: [-150, 150, -150],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating circles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute border-2 border-blue-300/20 dark:border-blue-400/10 rounded-full"
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Additional glow effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-400/10 dark:bg-pink-400/5 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 1,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-cyan-400/10 dark:bg-cyan-400/5 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 2,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default Background;