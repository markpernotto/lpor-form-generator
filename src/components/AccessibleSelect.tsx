import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface AccessibleSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  helpText?: string;
  errorMessage?: string;
  placeholder?: string;
}

export const AccessibleSelect: React.FC<
  AccessibleSelectProps
> = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  helpText,
  errorMessage,
  placeholder,
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

  const selectClasses = `
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

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-describedby={
          describedBy || undefined
        }
        aria-invalid={
          errorMessage ? "true" : "false"
        }
        className={selectClasses}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

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
