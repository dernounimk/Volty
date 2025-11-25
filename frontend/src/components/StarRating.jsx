import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm">
      {[1,2,3,4,5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none transition-all duration-200 hover:scale-110"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            size={32}
            className={`cursor-pointer transition-all duration-200 ${
              (hover || rating) >= star
                ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;