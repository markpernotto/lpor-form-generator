import React from "react";
import { VoiceInput } from "./VoiceInput";

interface AccessibleTextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "url";
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  errorMessage?: string;
  autoComplete?: string;
  enableVoiceInput?: boolean;
  maxLength?: number;
  pattern?: string;
  minLength?: number;
}

export const AccessibleTextInput: React.FC<
  AccessibleTextInputProps
> = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  helpText,
  errorMessage,
  autoComplete,
  enableVoiceInput = false,
  maxLength,
  pattern,
  minLength,
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
    // For text inputs, replace the value (append if you prefer)
    onChange(transcript);
  };

  const inputClasses = `
    w-full p-3 border rounded-md transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    dark:text-gray-100
    ${
      errorMessage
        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:bg-red-900/20 dark:focus:border-red-400"
        : "border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500"
    }
  `.trim();

  const labelClasses = `
    block text-sm font-medium mb-2
    ${
      errorMessage
        ? "text-red-700 dark:text-red-400"
        : "text-gray-700 dark:text-gray-300"
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
        <input
          id={id}
          type={type}
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
          maxLength={maxLength}
          pattern={pattern}
          minLength={minLength}
        />

        {enableVoiceInput && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <VoiceInput
              onResult={handleVoiceResult}
            />
          </div>
        )}
      </div>

      {helpText && (
        <p
          id={helpTextId}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {helpText}
        </p>
      )}

      {errorMessage && (
        <p
          id={errorId}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};
