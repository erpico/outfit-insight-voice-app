
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  messageType?: 'text' | 'image' | 'voice' | 'action';
  imageUrl?: string;
}

export interface ChatContextType {
  messages: Message[];
  isProcessing: boolean;
  currentStep: number;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  addImageMessage: (imageUrl: string) => void;
  processNextStep: () => void;
  userLikedOutfit: (outfitId: number) => void;
  likedOutfits: number[];
}

export interface Outfit {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
}
