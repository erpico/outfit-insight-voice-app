
import React from 'react';
import { useChat, STEPS } from '../context/ChatContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import CameraCapture from './CameraCapture';
import VoiceRecorder from './VoiceRecorder';
import OutfitGallery from './OutfitGallery';
import { Input } from '@/components/ui/input';
import { Send, Camera, Mic, ThumbsUp, MessageCircle } from 'lucide-react';
import { sendMessageToOpenAI } from '../services/openai';

const StepGuide: React.FC = () => {
  const [inputValue, setInputValue] = React.useState('');
  const { 
    messages, 
    addMessage, 
    addImageMessage, 
    isProcessing, 
    currentStep,
    processNextStep,
    likedOutfits
  } = useChat();

  const getLastAssistantMessage = () => {
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    return assistantMessages[assistantMessages.length - 1]?.content || '';
  };

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

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto">
      <div className="flex-1">
        {currentStep === STEPS.WELCOME && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">Welcome to Your Style Assistant</h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Let's create your personalized style profile in just a few steps
            </p>
            <Alert>
              <AlertTitle>How it works</AlertTitle>
              <AlertDescription>
                We'll guide you through 4 simple steps to understand your style preferences and provide personalized recommendations.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={processNextStep} 
              disabled={isProcessing}
              size="lg"
              className="mt-8"
            >
              Get Started
            </Button>
          </div>
        )}

        {currentStep === STEPS.PHOTO && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Take a Photo</h2>
              <p className="text-muted-foreground">
                Let's capture a full-length photo to understand your body type and current style.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <CameraCapture onCapture={handleCameraCapture} />
            </div>
          </div>
        )}

        {currentStep === STEPS.LIFESTYLE && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Tell Us About Your Lifestyle</h2>
              <p className="text-muted-foreground">
                Share details about your daily routine, work environment, and activities.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
            </div>
          </div>
        )}

        {currentStep === STEPS.OUTFIT_PREFERENCES && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Select Outfits You Like</h2>
              <p className="text-muted-foreground">
                Like at least one outfit that matches your style preferences.
              </p>
            </div>
            <OutfitGallery />
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleContinue}
                disabled={likedOutfits.length === 0}
                size="lg"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {currentStep === STEPS.FINAL_REQUEST && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Your Style Request</h2>
              <p className="text-muted-foreground">
                What specific style advice are you looking for today?
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg mb-6 max-w-md mx-auto">
              <p className="mb-2 font-semibold">Your Profile Summary:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Body Type: Analyzed from your photo</li>
                <li>Lifestyle: Creative professional with active weekends</li>
                <li>Style Preferences: {likedOutfits.length} outfit(s) liked</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
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
                  disabled={isProcessing || !inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {messages.filter(m => m.role === 'assistant' && messages.indexOf(m) > messages.findIndex(msg => msg.role === 'user' && msg.content === inputValue)).map((message, index) => (
                <div key={message.id} className="bg-secondary p-4 rounded-lg">
                  {message.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {currentStep > STEPS.WELCOME && <Camera className="h-4 w-4" />}
            {currentStep > STEPS.PHOTO && <Mic className="h-4 w-4" />}
            {currentStep > STEPS.LIFESTYLE && <ThumbsUp className="h-4 w-4" />}
            {currentStep > STEPS.OUTFIT_PREFERENCES && <MessageCircle className="h-4 w-4" />}
          </div>
          <div>
            Step {currentStep + 1} of 5
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepGuide;
