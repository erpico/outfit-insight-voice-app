
import React from 'react';
import { Heart } from 'lucide-react';
import { Outfit } from '../types';
import { cn } from '@/lib/utils';

interface OutfitCardProps {
  outfit: Outfit;
  isLiked: boolean;
  onLike: () => void;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, isLiked, onLike }) => {
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-md transition-all hover:shadow-lg">
      <div className="relative">
        <img 
          src={outfit.imageUrl} 
          alt={outfit.name} 
          className="w-full h-64 object-cover"
        />
        <button 
          onClick={onLike}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full",
            isLiked 
              ? "bg-accent text-white" 
              : "bg-white/80 text-foreground hover:bg-white"
          )}
        >
          <Heart 
            className={cn("h-5 w-5", isLiked ? "fill-current" : "")} 
          />
        </button>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium">{outfit.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{outfit.description}</p>
      </div>
    </div>
  );
};

export default OutfitCard;
