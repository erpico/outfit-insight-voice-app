
import React from 'react';
import { Message } from '../types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  if (isSystem) {
    return (
      <div className="py-2 px-4 text-xs text-center text-muted-foreground">
        {message.content}
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[85%] rounded-xl p-4 shadow-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}
      >
        {message.messageType === 'image' && message.imageUrl && (
          <div className="mb-2">
            <img 
              src={message.imageUrl} 
              alt="User uploaded photo" 
              className="w-full h-auto rounded-md object-contain max-h-80" 
            />
          </div>
        )}
        
        <div className="text-sm">{message.content}</div>
        
        <div className={cn(
          "text-xs mt-1",
          isUser ? "text-primary-foreground/70" : "text-secondary-foreground/70"
        )}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
