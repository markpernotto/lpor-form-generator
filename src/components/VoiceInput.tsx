import React, {
  useState,
  useCallback,
} from "react";

// Type definitions for Web Speech API
interface SpeechRecognitionInterface {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult:
    | ((event: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((
        event: SpeechRecognitionErrorEvent,
      ) => void)
    | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInterface;
    webkitSpeechRecognition?: new () => SpeechRecognitionInterface;
  }
}

interface VoiceInputProps {
  onResult: (transcript: string) => void;
  language?: string;
}

export const VoiceInput: React.FC<
  VoiceInputProps
> = ({ onResult, language = "en-US" }) => {
  const [isListening, setIsListening] =
    useState(false);
  const [isSupported, setIsSupported] =
    useState(true);

  const startListening = useCallback(() => {
    // Check for speech recognition support
    const hasWebkitSpeechRecognition =
      "webkitSpeechRecognition" in window;
    const hasSpeechRecognition =
      "SpeechRecognition" in window;

    if (
      !hasWebkitSpeechRecognition &&
      !hasSpeechRecognition
    ) {
      setIsSupported(false);
      return;
    }

    // Use the available speech recognition API
    const SpeechRecognitionClass =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) return;

    const recognition =
      new SpeechRecognitionClass();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (
      event: SpeechRecognitionEvent,
    ) => {
      const transcript =
        event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (
      event: SpeechRecognitionErrorEvent,
    ) => {
      console.error(
        "Speech recognition error:",
        event.error,
      );
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onResult, language]);

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={startListening}
      disabled={isListening}
      className={`ml-2 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isListening
          ? "bg-red-100 text-red-700 border-red-300"
          : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
      } border transition-colors`}
      aria-label={
        isListening
          ? "Recording voice input"
          : "Start voice input"
      }
      title={
        isListening
          ? "Recording..."
          : "Click to speak"
      }
    >
      {isListening ? (
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0v-3a4 4 0 118 0v3zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};
