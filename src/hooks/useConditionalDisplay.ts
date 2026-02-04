import { useMemo } from "react";
import { useFormState } from "../contexts/FormStateContext";
import type { MasterFormData } from "../contexts/FormStateContext";

/**
 * Conditional Display Hook
 *
 * Evaluates dependency expressions from the schema to determine field visibility.
 * Examples:
 * - "show_if:keep_address_private=false"
 * - "show_if:number_of_children>=1"
 * - "show_if:filing_for=behalf"
 * - "show_if:have_children=true&request_stay_away=true"
 */

type ComparisonOperator =
  | "="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<=";

interface DependencyCondition {
  field: string;
  operator: ComparisonOperator;
  value: string | number | boolean;
}

/**
 * Parse a dependency string into structured conditions
 * @param dependency - String like "show_if:keep_address_private=false"
 * @returns Array of conditions to evaluate
 */
function parseDependency(
  dependency: string,
): DependencyCondition[] {
  if (!dependency || dependency === "null") {
    return [];
  }

  // Remove "show_if:" prefix if present
  const cleanDep = dependency.replace(
    /^show_if:/i,
    "",
  );

  // Split on & for multiple conditions
  const parts = cleanDep.split("&");

  return parts.map((part) => {
    // Match operators in order of specificity
    let operator: ComparisonOperator;
    let field: string;
    let valueStr: string;

    if (part.includes(">=")) {
      [field, valueStr] = part.split(">=");
      operator = ">=";
    } else if (part.includes("<=")) {
      [field, valueStr] = part.split("<=");
      operator = "<=";
    } else if (part.includes("!=")) {
      [field, valueStr] = part.split("!=");
      operator = "!=";
    } else if (part.includes(">")) {
      [field, valueStr] = part.split(">");
      operator = ">";
    } else if (part.includes("<")) {
      [field, valueStr] = part.split("<");
      operator = "<";
    } else {
      // Default to equals
      [field, valueStr] = part.split("=");
      operator = "=";
    }

    field = field.trim();
    valueStr = valueStr.trim();

    // Convert value to appropriate type
    let value: string | number | boolean;
    if (valueStr === "true") {
      value = true;
    } else if (valueStr === "false") {
      value = false;
    } else if (!isNaN(Number(valueStr))) {
      value = Number(valueStr);
    } else {
      value = valueStr;
    }

    return { field, operator, value };
  });
}

/**
 * Evaluate a single condition against form data
 */
function evaluateCondition(
  condition: DependencyCondition,
  formData: MasterFormData,
): boolean {
  const fieldValue =
    formData[
      condition.field as keyof MasterFormData
    ];

  switch (condition.operator) {
    case "=":
      return fieldValue === condition.value;
    case "!=":
      return fieldValue !== condition.value;
    case ">":
      return (
        Number(fieldValue) >
        Number(condition.value)
      );
    case ">=":
      return (
        Number(fieldValue) >=
        Number(condition.value)
      );
    case "<":
      return (
        Number(fieldValue) <
        Number(condition.value)
      );
    case "<=":
      return (
        Number(fieldValue) <=
        Number(condition.value)
      );
    default:
      return false;
  }
}

/**
 * Hook to determine if a field should be visible based on dependencies
 * @param dependency - Dependency string from schema
 * @returns boolean indicating if field should be shown
 */
export function useConditionalDisplay(
  dependency: string | null | undefined,
): boolean {
  const { formData } = useFormState();

  return useMemo(() => {
    // If no dependency, always show
    if (!dependency || dependency === "null") {
      return true;
    }

    // Parse and evaluate all conditions
    const conditions =
      parseDependency(dependency);

    // All conditions must be true (AND logic)
    return conditions.every((condition) =>
      evaluateCondition(condition, formData),
    );
  }, [dependency, formData]);
}

/**
 * Hook for multiple dependencies (OR logic across different dependency strings)
 * @param dependencies - Array of dependency strings
 * @returns boolean indicating if field should be shown if ANY dependency is met
 */
export function useConditionalDisplayOr(
  dependencies: (string | null | undefined)[],
): boolean {
  const { formData } = useFormState();

  return useMemo(() => {
    // If no dependencies, always show
    if (dependencies.length === 0) {
      return true;
    }

    // Check if any dependency is satisfied (OR logic)
    return dependencies.some((dep) => {
      if (!dep || dep === "null") {
        return true;
      }

      const conditions = parseDependency(dep);
      return conditions.every((condition) =>
        evaluateCondition(condition, formData),
      );
    });
  }, [dependencies, formData]);
}

/**
 * Hook to get visibility state for multiple fields at once
 * @param fieldDependencies - Object mapping field names to their dependency strings
 * @returns Object with same keys, values are visibility booleans
 */
export function useBatchConditionalDisplay(
  fieldDependencies: Record<
    string,
    string | null | undefined
  >,
): Record<string, boolean> {
  const { formData } = useFormState();

  return useMemo(() => {
    const result: Record<string, boolean> = {};

    for (const [
      fieldName,
      dependency,
    ] of Object.entries(fieldDependencies)) {
      if (!dependency || dependency === "null") {
        result[fieldName] = true;
      } else {
        const conditions =
          parseDependency(dependency);
        result[fieldName] = conditions.every(
          (condition) =>
            evaluateCondition(
              condition,
              formData,
            ),
        );
      }
    }

    return result;
  }, [fieldDependencies, formData]);
}
