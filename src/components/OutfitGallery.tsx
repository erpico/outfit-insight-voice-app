
import React from 'react';
import OutfitCard from './OutfitCard';
import { Outfit } from '../types';
import { useChat } from '../context/ChatContext';

// Sample outfit data
const SAMPLE_OUTFITS: Outfit[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    name: 'Casual Chic Ensemble',
    description: 'Perfect for weekend brunches and casual meetups.'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1553754538-466add009c05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80',
    name: 'Business Casual',
    description: 'Professional yet comfortable for the modern workplace.'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1566677914817-56426959ae9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80',
    name: 'Weekend Relaxed',
    description: 'Effortless style for your days off.'
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1536766820879-059fec98ec0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    name: 'Evening Elegance',
    description: 'Sophisticated attire for special occasions.'
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1555069519-127aadedf1ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    name: 'Athleisure Style',
    description: 'Sporty yet stylish for active days.'
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=672&q=80',
    name: 'Minimalist Modern',
    description: 'Clean lines and neutral tones for a timeless look.'
  }
];

const OutfitGallery: React.FC = () => {
  const { likedOutfits, userLikedOutfit } = useChat();

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        {SAMPLE_OUTFITS.map((outfit) => (
          <OutfitCard 
            key={outfit.id} 
            outfit={outfit} 
            isLiked={likedOutfits.includes(outfit.id)}
            onLike={() => userLikedOutfit(outfit.id)}
          />
        ))}
      </div>
      
      {likedOutfits.length > 0 && (
        <div className="mt-4 text-sm text-center text-muted-foreground">
          You've liked {likedOutfits.length} outfit{likedOutfits.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default OutfitGallery;
