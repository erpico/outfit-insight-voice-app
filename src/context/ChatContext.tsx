
import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatContextType } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const STEPS = {
  WELCOME: 0,
  PHOTO: 1,
  LIFESTYLE: 2,
  OUTFIT_PREFERENCES: 3,
  FINAL_REQUEST: 4
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useLocalStorage<Message[]>('chat-messages', []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useLocalStorage('current-step', STEPS.WELCOME);
  const [likedOutfits, setLikedOutfits] = useLocalStorage<number[]>('liked-outfits', []);
  
  // Initialize with welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: uuidv4(),
          role: 'system',
          content: "I'm your personal style assistant. Let's create your fashion profile!",
          timestamp: Date.now()
        },
        {
          id: uuidv4(),
          role: 'assistant',
          content: "Hi there! I'm your AI style assistant. I'll help you discover outfits that match your personal style. Let's get started with a few steps to understand your preferences better.",
          timestamp: Date.now()
        }
      ]);
    }
  }, [messages.length, setMessages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: uuidv4(),
      timestamp: Date.now()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };

  const addImageMessage = (imageUrl: string) => {
    const newMessage = {
      id: uuidv4(),
      role: 'user',
      content: 'Uploaded a photo',
      imageUrl,
      messageType: 'image' as const,
      timestamp: Date.now()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };

  const processNextStep = () => {
    setIsProcessing(true);
    
    // Move to the next step
    const nextStep = currentStep + 1;

    // Add appropriate assistant message based on the new step
    setTimeout(() => {
      setCurrentStep(nextStep);
      
      switch(nextStep) {
        case STEPS.PHOTO:
          addMessage({
            role: 'assistant',
            content: "Great! First, let's take a full-length photo so I can understand your body type and current style. Please take a photo in good lighting, standing straight to show your full height.",
            messageType: 'text'
          });
          break;
        case STEPS.LIFESTYLE:
          addMessage({
            role: 'assistant',
            content: "Perfect! Now, tell me about your lifestyle. What's your daily routine like? Do you work in a formal environment or casual? What activities do you enjoy outside of work? Feel free to speak your response.",
            messageType: 'text'
          });
          break;
        case STEPS.OUTFIT_PREFERENCES:
          addMessage({
            role: 'assistant',
            content: "Thanks for sharing! Now I'll show you some outfit options. Please like the ones that appeal to you so I can better understand your style preferences.",
            messageType: 'text'
          });
          break;
        case STEPS.FINAL_REQUEST:
          addMessage({
            role: 'assistant',
            content: "Great choices! Based on everything I've learned about you, what specific fashion advice or outfit recommendations are you looking for today?",
            messageType: 'text'
          });
          break;
        default:
          break;
      }
      
      setIsProcessing(false);
    }, 1000);
  };

  const userLikedOutfit = (outfitId: number) => {
    setLikedOutfits(prev => {
      if (prev.includes(outfitId)) {
        return prev.filter(id => id !== outfitId);
      } else {
        return [...prev, outfitId];
      }
    });
  };

  return (
    <ChatContext.Provider value={{
      messages,
      isProcessing,
      currentStep,
      addMessage,
      addImageMessage,
      processNextStep,
      userLikedOutfit,
      likedOutfits
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
