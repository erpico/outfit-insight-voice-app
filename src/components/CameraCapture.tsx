
import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCapture = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          aspectRatio: 0.75 // Portrait aspect ratio for full-body photos
        } 
      });
      
      setStream(mediaStream);
      setIsCapturing(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Stop tracks
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsCapturing(false);
        
        // Call onCapture with the image data
        onCapture(imageDataUrl);
      }
    }
  };

  const cancelCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCapturing(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {isCapturing ? (
        <div className="relative w-full">
          <video 
            ref={videoRef} 
            className="w-full rounded-lg mx-auto shadow-lg" 
            autoPlay 
            playsInline
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white"
              onClick={cancelCapture}
            >
              ✕
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              className="bg-accent hover:bg-accent/80"
              onClick={capturePhoto}
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {error && (
            <div className="text-destructive text-sm mb-4">
              {error}
            </div>
          )}
          <Button 
            variant="default" 
            className="flex items-center gap-2"
            onClick={startCapture}
          >
            <Camera className="h-5 w-5" />
            Take Full-Body Photo
          </Button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      
      {isCapturing && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Position yourself so your full body is visible
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
