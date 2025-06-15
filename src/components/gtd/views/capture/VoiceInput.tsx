
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isRecording?: boolean;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscription, 
  isRecording = false,
  onRecordingStateChange 
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      // Configure speech recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Handle speech results
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        onTranscription(finalTranscriptRef.current + interimTranscript);
      };

      // Handle errors
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        onRecordingStateChange?.(false);
        
        let errorMessage = 'Speech recognition failed';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error occurred during speech recognition.';
            break;
        }
        
        toast({
          title: "Speech Recognition Error",
          description: errorMessage,
          variant: "destructive"
        });
      };

      // Handle speech end
      recognition.onend = () => {
        onRecordingStateChange?.(false);
      };
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [onTranscription, onRecordingStateChange, toast]);

  const startRecording = () => {
    if (!recognitionRef.current || !isSupported) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition. Please use Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    try {
      finalTranscriptRef.current = '';
      recognitionRef.current.start();
      onRecordingStateChange?.(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Error",
        description: "Failed to start speech recognition",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled
        className="flex items-center space-x-1 text-slate-500"
        title="Speech recognition not supported in this browser"
      >
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {!isRecording ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={startRecording}
          className="flex items-center space-x-1 text-cyan-500 hover:text-cyan-400 transition-colors"
          title="Start voice input"
        >
          <Mic className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={stopRecording}
          className="flex items-center space-x-1 text-red-500 hover:text-red-400 animate-pulse"
          title="Stop voice input"
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default VoiceInput;
