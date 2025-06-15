
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  onAudioData?: (audioBlob: Blob) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, onAudioData }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        onAudioData?.(blob);
        
        // For now, we'll just show a placeholder transcription
        // In a real implementation, you'd send this to a speech-to-text service
        const placeholderText = "Voice recording captured. Transcription would appear here.";
        onTranscription(placeholderText);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Speak clearly to capture your task details"
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast({
        title: "Recording stopped",
        description: "Processing your voice input..."
      });
    }
  };

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-3">
        {!isRecording ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startRecording}
            className="flex items-center space-x-2"
          >
            <Mic className="h-4 w-4" />
            <span>Start Recording</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={stopRecording}
            className="flex items-center space-x-2 animate-pulse"
          >
            <Square className="h-4 w-4" />
            <span>Stop ({formatTime(recordingTime)})</span>
          </Button>
        )}
        
        {audioBlob && !isRecording && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={isPlaying ? pauseRecording : playRecording}
            className="flex items-center space-x-2"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
        )}
      </div>
      
      {isRecording && (
        <div className="text-sm text-muted-foreground">
          Recording: {formatTime(recordingTime)}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
