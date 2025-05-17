
import React from 'react';
import { ChatProvider } from '../context/ChatContext';
import ChatInterface from '../components/ChatInterface';
import Header from '../components/Header';

const Index = () => {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <main className="flex-1 overflow-hidden flex flex-col">
          <ChatInterface />
        </main>
      </div>
    </ChatProvider>
  );
};

export default Index;
