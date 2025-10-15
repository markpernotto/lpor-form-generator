import React from "react";

export interface RadioOption {
  value: string;
  label: string;
  helpText?: string;
  disabled?: boolean;
}

interface AccessibleRadioGroupProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  helpText?: string;
  errorMessage?: string;
  layout?: "vertical" | "horizontal";
}

export const AccessibleRadioGroup: React.FC<
  AccessibleRadioGroupProps
> = ({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  helpText,
  errorMessage,
  layout = "vertical",
}) => {
  const helpTextId = helpText
    ? `${name}-help`
    : undefined;
  const errorId = errorMessage
    ? `${name}-error`
    : undefined;
  const describedBy = [helpTextId, errorId]
    .filter(Boolean)
    .join(" ");

  const fieldsetClasses = `
    border rounded-md p-4 transition-colors
    ${
      errorMessage
        ? "border-red-300 bg-red-50"
        : "border-gray-300"
    }
  `.trim();

  const legendClasses = `
    text-sm font-medium px-2 -ml-2
    ${
      errorMessage
        ? "text-red-700"
        : "text-gray-700"
    }
  `.trim();

  const optionsContainerClasses = `
    space-y-3 mt-3
    ${
      layout === "horizontal"
        ? "sm:flex sm:space-y-0 sm:space-x-6"
        : ""
    }
  `.trim();

  const radioClasses = `
    h-4 w-4 text-blue-600 border-gray-300 transition-colors
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `.trim();

  const optionLabelClasses = `
    ml-2 text-sm text-gray-700 cursor-pointer select-none
  `.trim();

  return (
    <fieldset
      className={fieldsetClasses}
      aria-describedby={describedBy || undefined}
      aria-invalid={
        errorMessage ? "true" : "false"
      }
      role="radiogroup"
    >
      <legend className={legendClasses}>
        {label}
        {required && (
          <span
            className="text-red-500 ml-1"
            aria-label="required"
          >
            *
          </span>
        )}
      </legend>

      <div className={optionsContainerClasses}>
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          const optionHelpId = option.helpText
            ? `${optionId}-help`
            : undefined;

          return (
            <div
              key={option.value}
              className="flex items-start"
            >
              <div className="flex items-center">
                <input
                  id={optionId}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) =>
                    onChange(e.target.value)
                  }
                  required={required}
                  disabled={option.disabled}
                  aria-describedby={
                    optionHelpId || undefined
                  }
                  className={radioClasses}
                />
                <label
                  htmlFor={optionId}
                  className={`${optionLabelClasses} ${
                    option.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {option.label}
                </label>
              </div>
              {option.helpText && (
                <p
                  id={optionHelpId}
                  className="text-xs text-gray-500 ml-6 mt-1"
                >
                  {option.helpText}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {helpText && (
        <p
          id={helpTextId}
          className="text-sm text-gray-600 mt-3"
        >
          {helpText}
        </p>
      )}

      {errorMessage && (
        <p
          id={errorId}
          className="text-sm text-red-600 mt-3"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </fieldset>
  );
};
