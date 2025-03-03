import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number | null;
  onRate?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  onRate, 
  size = 24,
  interactive = true
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          fill={rating !== null && star <= rating ? "#e50914" : "none"}
          stroke={rating !== null && star <= rating ? "#e50914" : "#b3b3b3"}
          className={`${interactive ? 'cursor-pointer' : ''} transition-colors hover:stroke-primary`}
          onClick={() => interactive && onRate && onRate(star)}
        />
      ))}
    </div>
  );
};

export default RatingStars;