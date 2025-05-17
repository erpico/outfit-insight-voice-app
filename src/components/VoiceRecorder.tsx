
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Speech } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        setIsRecording(false);
        setRecordingTime(0);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {error && (
        <div className="text-destructive text-sm mb-4">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-center w-full">
        {isRecording ? (
          <>
            <div className="mr-4 text-sm font-medium">
              {formatTime(recordingTime)}
            </div>
            <Button 
              variant="destructive"
              className="flex items-center gap-2"
              onClick={stopRecording}
            >
              <MicOff className="h-5 w-5" />
              Stop Recording
            </Button>
          </>
        ) : (
          <Button 
            variant="default"
            className="flex items-center gap-2"
            onClick={startRecording}
          >
            <Mic className="h-5 w-5" />
            Start Voice Recording
          </Button>
        )}
      </div>
      
      {isRecording && (
        <div className="flex items-center mt-4 text-sm text-muted-foreground">
          <Speech className="h-4 w-4 mr-2 animate-pulse text-accent" />
          Tell me about your lifestyle and preferences...
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
