import React from "react";
import { AccessibleTextInput } from "./AccessibleTextInput";
import { AccessibleDateInput } from "./AccessibleDateInput";

export interface PersonEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  relationshipToPetitioner: string;
}

interface AccessiblePersonListProps {
  id: string;
  label: string;
  description?: string;
  entries: PersonEntry[];
  onEntriesChange: (
    entries: PersonEntry[],
  ) => void;
  addButtonText: string;
  emptyStateText: string;
  nameLabel: string;
  dobLabel: string;
  relationshipLabel: string;
  namePlaceholder?: string;
  relationshipPlaceholder?: string;
  required?: boolean;
  error?: string;
}

export const AccessiblePersonList: React.FC<
  AccessiblePersonListProps
> = ({
  id,
  label,
  description,
  entries,
  onEntriesChange,
  addButtonText,
  emptyStateText,
  nameLabel,
  dobLabel,
  relationshipLabel,
  namePlaceholder,
  relationshipPlaceholder,
  required = false,
  error,
}) => {
  const addEntry = () => {
    const newEntry: PersonEntry = {
      id: `${Date.now()}-${Math.random()}`,
      name: "",
      dateOfBirth: "",
      relationshipToPetitioner: "",
    };
    onEntriesChange([...entries, newEntry]);
  };

  const removeEntry = (idToRemove: string) => {
    onEntriesChange(
      entries.filter(
        (entry) => entry.id !== idToRemove,
      ),
    );
  };

  const updateEntry = (
    id: string,
    field: keyof PersonEntry,
    value: string,
  ) => {
    onEntriesChange(
      entries.map((entry) =>
        entry.id === id
          ? { ...entry, [field]: value }
          : entry,
      ),
    );
  };

  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-medium text-gray-900">
        {label}
        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </legend>

      {description && (
        <p className="text-sm text-gray-600 mt-1">
          {description}
        </p>
      )}

      {error && (
        <div
          className="text-red-600 text-sm mt-1"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="space-y-6">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            {emptyStateText}
          </p>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.id}
              className="border border-gray-200 rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Entry {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    removeEntry(entry.id)
                  }
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                  aria-label={`Remove entry ${
                    index + 1
                  }`}
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AccessibleTextInput
                  id={`${id}-${entry.id}-name`}
                  label={nameLabel}
                  placeholder={namePlaceholder}
                  value={entry.name}
                  onChange={(value) =>
                    updateEntry(
                      entry.id,
                      "name",
                      value,
                    )
                  }
                  required={true}
                />

                <AccessibleDateInput
                  id={`${id}-${entry.id}-dob`}
                  label={dobLabel}
                  value={entry.dateOfBirth}
                  onChange={(value) =>
                    updateEntry(
                      entry.id,
                      "dateOfBirth",
                      value,
                    )
                  }
                  required={true}
                />

                <AccessibleTextInput
                  id={`${id}-${entry.id}-relationship`}
                  label={relationshipLabel}
                  placeholder={
                    relationshipPlaceholder
                  }
                  value={
                    entry.relationshipToPetitioner
                  }
                  onChange={(value) =>
                    updateEntry(
                      entry.id,
                      "relationshipToPetitioner",
                      value,
                    )
                  }
                  required={true}
                />
              </div>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={addEntry}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="mr-2">+</span>
          {addButtonText}
        </button>
      </div>
    </fieldset>
  );
};
