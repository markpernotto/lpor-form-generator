import React from "react";

interface AccessibleDateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "date" | "datetime-local" | "time";
  required?: boolean;
  helpText?: string;
  errorMessage?: string;
  min?: string;
  max?: string;
  step?: string;
}

export const AccessibleDateInput: React.FC<
  AccessibleDateInputProps
> = ({
  id,
  label,
  value,
  onChange,
  type = "date",
  required = false,
  helpText,
  errorMessage,
  min,
  max,
  step,
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

  const inputClasses = `
    w-full p-3 border rounded-md transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    dark:text-gray-100 dark:[color-scheme:dark]
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

  // Format help text based on input type
  const getFormatHelpText = () => {
    if (helpText) return helpText;

    switch (type) {
      case "date":
        return "Format: YYYY-MM-DD";
      case "time":
        return "Format: HH:MM";
      case "datetime-local":
        return "Format: YYYY-MM-DD HH:MM";
      default:
        return undefined;
    }
  };

  const finalHelpText = getFormatHelpText();

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

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-describedby={
          describedBy || undefined
        }
        aria-invalid={
          errorMessage ? "true" : "false"
        }
        className={inputClasses}
        min={min}
        max={max}
        step={step}
      />

      {finalHelpText && (
        <p
          id={helpTextId}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {finalHelpText}
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
