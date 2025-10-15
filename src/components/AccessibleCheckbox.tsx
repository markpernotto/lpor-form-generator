import React from "react";

interface AccessibleCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  helpText?: string;
  errorMessage?: string;
  disabled?: boolean;
  indeterminate?: boolean;
}

export const AccessibleCheckbox: React.FC<
  AccessibleCheckboxProps
> = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  helpText,
  errorMessage,
  disabled = false,
  indeterminate = false,
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

  const checkboxRef =
    React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        indeterminate;
    }
  }, [indeterminate]);

  const checkboxClasses = `
    h-4 w-4 text-blue-600 border-gray-300 rounded transition-colors
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${
      errorMessage
        ? "border-red-300"
        : "border-gray-300"
    }
    ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer"
    }
  `.trim();

  const labelClasses = `
    ml-2 text-sm font-medium select-none
    ${
      errorMessage
        ? "text-red-700"
        : "text-gray-700"
    }
    ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer"
    }
  `.trim();

  return (
    <div className="space-y-2">
      <div className="flex items-start">
        <input
          ref={checkboxRef}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) =>
            onChange(e.target.checked)
          }
          required={required}
          disabled={disabled}
          aria-describedby={
            describedBy || undefined
          }
          aria-invalid={
            errorMessage ? "true" : "false"
          }
          className={checkboxClasses}
        />
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
      </div>

      {helpText && (
        <p
          id={helpTextId}
          className="text-sm text-gray-600 ml-6"
        >
          {helpText}
        </p>
      )}

      {errorMessage && (
        <p
          id={errorId}
          className="text-sm text-red-600 ml-6"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};
