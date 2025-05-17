
import React, { useRef, useEffect, useState } from 'react';
import { useChat, STEPS } from '../context/ChatContext';
import MessageItem from './MessageItem';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CameraCapture from './CameraCapture';
import VoiceRecorder from './VoiceRecorder';
import OutfitGallery from './OutfitGallery';
import { sendMessageToOpenAI } from '../services/openai';

const ChatInterface: React.FC = () => {
  const { 
    messages, 
    addMessage, 
    addImageMessage, 
    isProcessing, 
    currentStep,
    processNextStep,
    likedOutfits
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && currentStep !== STEPS.FINAL_REQUEST) return;
    
    if (currentStep === STEPS.FINAL_REQUEST) {
      const userMessage = addMessage({
        role: 'user',
        content: inputValue,
        messageType: 'text'
      });
      setInputValue('');
      
      // Send to OpenAI and get response
      try {
        // Convert chat history to OpenAI format
        const messageHistory = messages
          .filter(m => m.role !== 'system')
          .map(m => ({ 
            role: m.role, 
            content: m.imageUrl 
              ? `[User uploaded an image]${m.content}` 
              : m.content 
          }));
          
        // Add the latest user message
        messageHistory.push({
          role: 'user',
          content: userMessage.content
        });
        
        // Add context about liked outfits
        if (likedOutfits.length > 0) {
          messageHistory.push({
            role: 'user',
            content: `I liked outfits with IDs: ${likedOutfits.join(', ')}`
          });
        }
        
        // Get AI response
        const response = await sendMessageToOpenAI(messageHistory);
        
        if (response && response.content) {
          addMessage({
            role: 'assistant',
            content: response.content,
            messageType: 'text'
          });
        } else {
          throw new Error('Invalid response from AI');
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        addMessage({
          role: 'assistant',
          content: "I'm sorry, I had trouble processing your request. Could you try again?",
          messageType: 'text'
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    addImageMessage(imageDataUrl);
    processNextStep();
  };

  const handleVoiceRecording = (audioBlob: Blob) => {
    // In a real app, you would send this audio to a speech-to-text service
    // For now, we'll mock it with a static message
    addMessage({
      role: 'user',
      content: "I enjoy a casual lifestyle. I work in a creative office where the dress code is business casual. On weekends, I like to go hiking and meet friends for drinks. I prefer comfortable yet stylish clothes that can transition between different settings.",
      messageType: 'voice'
    });
    
    processNextStep();
  };

  const handleContinue = () => {
    if (currentStep === STEPS.OUTFIT_PREFERENCES && likedOutfits.length > 0) {
      processNextStep();
    }
  };

  // Render different input based on current step
  const renderStepInput = () => {
    switch(currentStep) {
      case STEPS.WELCOME:
        return (
          <div className="flex justify-center p-4">
            <Button onClick={processNextStep} disabled={isProcessing}>
              Get Started
            </Button>
          </div>
        );
      
      case STEPS.PHOTO:
        return <CameraCapture onCapture={handleCameraCapture} />;
      
      case STEPS.LIFESTYLE:
        return <VoiceRecorder onRecordingComplete={handleVoiceRecording} />;
      
      case STEPS.OUTFIT_PREFERENCES:
        return (
          <div className="flex flex-col items-center">
            <OutfitGallery />
            <div className="mt-4">
              <Button 
                onClick={handleContinue} 
                disabled={likedOutfits.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        );
      
      case STEPS.FINAL_REQUEST:
        return (
          <div className="flex gap-2">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for style advice..."
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage} 
              disabled={isProcessing}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        {renderStepInput()}
      </div>
    </div>
  );
};

export default ChatInterface;
