import { Star, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const StarRating = ({ rating, setRating, size = "md", animated = true }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const sizes = {
    sm: { icon: 20, container: "gap-1" },
    md: { icon: 28, container: "gap-2" },
    lg: { icon: 36, container: "gap-3" }
  };

  const { icon: iconSize, container: containerClass } = sizes[size];

  const handleClick = (value) => {
    if (setRating) {
      setRating(value);
    }
  };

  return (
    <div className={`flex items-center ${containerClass}`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const isActive = value <= (hoveredRating || rating);
        const isHalfActive = value === Math.ceil(rating) && rating % 1 !== 0;
        
        return (
          <motion.button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            whileHover={animated ? { scale: 1.2 } : {}}
            whileTap={animated ? { scale: 0.9 } : {}}
            className="relative focus:outline-none"
          >
            <motion.div
              initial={animated ? { scale: 0, rotate: -180 } : false}
              animate={animated ? { scale: 1, rotate: 0 } : false}
              transition={{ delay: value * 0.05, type: "spring" }}
            >
              <Star
                size={iconSize}
                className={`${
                  isActive
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                } transition-all duration-300 ${
                  isActive ? "drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : ""
                }`}
              />
              
              {isHalfActive && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "50%" }}
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <Star
                    size={iconSize}
                    className="text-yellow-400 fill-yellow-400"
                  />
                </motion.div>
              )}
              
              {isActive && animated && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </motion.div>
              )}
            </motion.div>
            
            {animated && hoveredRating === value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap"
              >
                {value} {value === 1 ? "star" : "stars"}
              </motion.div>
            )}
          </motion.button>
        );
      })}
      
      {rating > 0 && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-4 text-lg font-bold text-gray-900 dark:text-white"
        >
          {rating.toFixed(1)}
        </motion.span>
      )}
    </div>
  );
};

export default StarRating;