
import React from 'react';
import { useChat, STEPS } from '../context/ChatContext';

const Header: React.FC = () => {
  const { currentStep } = useChat();
  
  const getStepTitle = () => {
    switch(currentStep) {
      case STEPS.WELCOME:
        return "Welcome";
      case STEPS.PHOTO:
        return "Take Your Photo";
      case STEPS.LIFESTYLE:
        return "Your Lifestyle";
      case STEPS.OUTFIT_PREFERENCES:
        return "Style Preferences";
      case STEPS.FINAL_REQUEST:
        return "Style Assistant";
      default:
        return "Style Assistant";
    }
  };

  const getStepProgress = () => {
    // Calculate progress percentage from 0 to 4 steps
    return Math.min(100, (currentStep / 4) * 100);
  };

  return (
    <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
      <div className="flex flex-col">
        <h1 className="text-lg font-medium">{getStepTitle()}</h1>
        
        <div className="w-full bg-muted h-1 rounded-full mt-2 overflow-hidden">
          <div 
            className="bg-accent h-full transition-all duration-500 ease-in-out"
            style={{ width: `${getStepProgress()}%` }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
