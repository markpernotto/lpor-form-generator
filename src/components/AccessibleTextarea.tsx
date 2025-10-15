import React from "react";
import { VoiceInput } from "./VoiceInput";

interface AccessibleTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  errorMessage?: string;
  autoComplete?: string;
  enableVoiceInput?: boolean;
  rows?: number;
}

export const AccessibleTextarea: React.FC<
  AccessibleTextareaProps
> = ({
  id,
  label,
  value,
  onChange,
  required = false,
  placeholder,
  helpText,
  errorMessage,
  autoComplete,
  enableVoiceInput = false,
  rows = 3,
}) => {
  const helpTextId = helpText
    ? `${id}-help`
    : undefined;
  const errorId = errorMessage
    ? `${id}-error`
    : undefined;
  const describedBy = [helpTextId, errorId]
    .filter(Boolean)
    .join(" ");

  const handleVoiceResult = (
    transcript: string,
  ) => {
    // Append voice input to existing text
    const newValue = value
      ? `${value} ${transcript}`
      : transcript;
    onChange(newValue.trim());
  };

  const inputClasses = `
    w-full p-3 border rounded-md transition-colors resize-vertical
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${
      errorMessage
        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 bg-white hover:border-gray-400"
    }
  `.trim();

  const labelClasses = `
    block text-sm font-medium mb-2
    ${
      errorMessage
        ? "text-red-700"
        : "text-gray-700"
    }
  `.trim();

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={labelClasses}
      >
        {label}
        {required && (
          <span
            className="text-red-500 ml-1"
            aria-label="required"
          >
            *
          </span>
        )}
      </label>

      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-describedby={
            describedBy || undefined
          }
          aria-invalid={
            errorMessage ? "true" : "false"
          }
          className={inputClasses}
          rows={rows}
        />

        {enableVoiceInput && (
          <div className="absolute right-2 top-2">
            <VoiceInput
              onResult={handleVoiceResult}
            />
          </div>
        )}
      </div>

      {helpText && (
        <p
          id={helpTextId}
          className="text-sm text-gray-600"
        >
          {helpText}
        </p>
      )}

      {errorMessage && (
        <p
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};
