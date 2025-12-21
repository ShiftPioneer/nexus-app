import { useState, useRef, useCallback } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// User-friendly error messages for speech recognition errors
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'network':
      return 'Network error: Please check your internet connection and try again. Voice recognition requires a stable connection.';
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access denied. Please allow microphone access in your browser settings and reload the page.';
    case 'no-speech':
      return 'No speech detected. Please speak clearly into your microphone and try again.';
    case 'audio-capture':
      return 'No microphone found. Please connect a microphone and try again.';
    case 'aborted':
      return 'Voice input was cancelled.';
    case 'language-not-supported':
      return 'Your language is not supported. Voice input works best with English.';
    default:
      return `Voice recognition error: ${errorCode}. Please try again or use text input instead.`;
  }
};

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = Boolean(
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  );

  // Check if we're on HTTPS (required for speech recognition)
  const isSecureContext = typeof window !== 'undefined' && 
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost');

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setErrorCode('not-supported');
      return;
    }

    if (!isSecureContext) {
      setError('Voice input requires a secure connection (HTTPS). Please use text input instead.');
      setErrorCode('insecure-context');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setErrorCode(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const friendlyMessage = getErrorMessage(event.error);
        setError(friendlyMessage);
        setErrorCode(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setError('Failed to start voice input. Please try again or use text input.');
      setErrorCode('start-failed');
      setIsListening(false);
    }
  }, [isSupported, isSecureContext]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
    setErrorCode(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    errorCode,
    isSupported,
    isSecureContext,
    startListening,
    stopListening,
    resetTranscript,
  };
};