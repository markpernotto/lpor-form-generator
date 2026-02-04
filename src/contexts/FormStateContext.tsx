import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { MasterFormData } from "../types/generated";

export type { MasterFormData };

/**
 * Master Form State Context
 *
 * Holds all form data for the domestic violence protection order intake.
/**
 * Master Form State Context
 *
 * Holds all form data for the domestic violence protection order intake.
 * NO PERSISTENCE - All data is in-memory only for victim safety.
 * Data is completely wiped on page close/refresh.
 */

interface FormStateContextType {
  formData: MasterFormData;
  updateField: (
    field: string,
    value: unknown,
  ) => void;
  updateMultipleFields: (
    updates: Partial<MasterFormData>,
  ) => void;
  resetForm: () => void;
  isFormComplete: boolean;
}

const FormStateContext = createContext<
  FormStateContextType | undefined
>(undefined);

export const useFormState = () => {
  const context = useContext(FormStateContext);
  if (!context) {
    throw new Error(
      "useFormState must be used within FormStateProvider",
    );
  }
  return context;
};

interface FormStateProviderProps {
  children: ReactNode;
}

export const FormStateProvider: React.FC<
  FormStateProviderProps
> = ({ children }) => {
  const [formData, setFormData] =
    useState<MasterFormData>({
      // Initialize with safe defaults
      who_needs_protection: [],
      children: [],
      incompetent_persons: [],
      firearms: [],
      witnesses: [],
      venue_reasons: [],
      abuse_types: [],

      // Auto-populate some defaults
      request_no_abuse: true,
      request_no_contact: true,
      current_address_state: "LA",
    });

  const [hasUserData, setHasUserData] =
    useState(false);

  // Warn user before leaving if they have entered data
  useEffect(() => {
    const handleBeforeUnload = (
      e: BeforeUnloadEvent,
    ) => {
      if (hasUserData) {
        e.preventDefault();
        e.returnValue =
          "Your information is NOT saved. Leaving will lose all progress. Are you sure?";
        return e.returnValue;
      }
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload,
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload,
      );
    };
  }, [hasUserData]);

  // Track when user starts entering data
  useEffect(() => {
    const hasData = Object.keys(formData).some(
      (key) => {
        const value =
          formData[key as keyof MasterFormData];
        if (Array.isArray(value))
          return value.length > 0;
        if (typeof value === "boolean")
          return value !== false;
        if (typeof value === "string")
          return value !== "" && value !== "LA";
        return (
          value !== undefined && value !== null
        );
      },
    );
    setHasUserData(hasData);
  }, [formData]);

  const updateField = useCallback(
    (field: string, value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const updateMultipleFields = useCallback(
    (updates: Partial<MasterFormData>) => {
      setFormData((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFormData({
      who_needs_protection: [],
      children: [],
      incompetent_persons: [],
      firearms: [],
      witnesses: [],
      venue_reasons: [],
      abuse_types: [],
      request_no_abuse: true,
      request_no_contact: true,
      current_address_state: "LA",
    });
    setHasUserData(false);
  }, []);

  // Simple completeness check - can be enhanced later
  const isFormComplete = Boolean(
    formData.filing_type &&
    formData.filing_for &&
    formData.petitioner_full_name &&
    formData.abuser_name &&
    formData.statement_true &&
    formData.understand_perjury,
  );

  const value: FormStateContextType = {
    formData,
    updateField,
    updateMultipleFields,
    resetForm,
    isFormComplete,
  };

  return (
    <FormStateContext.Provider value={value}>
      {children}
    </FormStateContext.Provider>
  );
};
