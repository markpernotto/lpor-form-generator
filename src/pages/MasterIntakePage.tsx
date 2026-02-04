import React, { useState } from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageSelector } from "../components/LanguageSelector";
import { PDFDownloadModal } from "../components/PDFDownloadModal";
import { useFormState } from "../contexts/FormStateContext";

// Section imports
import {
  InitialSection,
  PetitionerSection,
  AccommodationsSection,
  VenueSection,
  SafetySection,
  ChildrenSection,
  DefendantSection,
  RelationshipSection,
  LegalStatusSection,
  AbuseSection,
  FirearmsSection,
  IncidentSection,
  ReliefSection,
  PropertySection,
  CustodySection,
  WitnessSection,
  AffirmationSection,
} from "../forms/shared/sections";

/**
 * Master Intake Page
 *
 * Single-page scrolling form for domestic violence protection order intake.
 * Combines all sections with collapsible UI and progress tracking.
 */

export const MasterIntakePage: React.FC = () => {
  const { resetForm, isFormComplete } =
    useFormState();

  // Track which sections are expanded
  const [expandedSections, setExpandedSections] =
    useState<Record<string, boolean>>({
      initial: true,
      petitioner: true,
      accommodations: false,
      venue: false,
      safety: false,
      children: false,
      defendant: false,
      relationship: false,
      legalStatus: false,
      abuse: false,
      firearms: false,
      incident: false,
      relief: false,
      property: false,
      custody: false,
      witness: false,
      affirmation: false,
    });

  // Modal state
  const [isPDFModalOpen, setIsPDFModalOpen] =
    useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormComplete) {
      alert(
        "Please complete all required fields before submitting.",
      );
      return;
    }

    // Open PDF generation modal
    setIsPDFModalOpen(true);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Protection Order Application
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Louisiana Petition for
                  Protection from Abuse
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Warning Banner */}
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>⚠️ Important:</strong> Your
              information is NOT saved. Complete
              this form in one session. Closing
              this page will lose all progress.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Introduction */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Before You Begin
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  This form will help you petition
                  the court for a protection order
                  against someone who has harmed
                  or threatened you.
                </p>
                <p>
                  <strong>You will need:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    Details about the person you
                    need protection from
                  </li>
                  <li>
                    Dates and descriptions of
                    incidents
                  </li>
                  <li>
                    Information about any children
                    who need protection
                  </li>
                  <li>
                    Your current address (or you
                    can keep it private)
                  </li>
                </ul>
                <p className="pt-2">
                  <strong>
                    Time to complete:
                  </strong>{" "}
                  20-30 minutes
                </p>
              </div>
            </div>

            {/* Sections */}
            <InitialSection
              isExpanded={
                expandedSections.initial
              }
              onToggle={() =>
                toggleSection("initial")
              }
            />

            <PetitionerSection
              isExpanded={
                expandedSections.petitioner
              }
              onToggle={() =>
                toggleSection("petitioner")
              }
            />

            <AccommodationsSection
              isExpanded={
                expandedSections.accommodations
              }
              onToggle={() =>
                toggleSection("accommodations")
              }
            />

            <VenueSection
              isExpanded={expandedSections.venue}
              onToggle={() =>
                toggleSection("venue")
              }
            />

            <SafetySection
              isExpanded={expandedSections.safety}
              onToggle={() =>
                toggleSection("safety")
              }
            />

            <ChildrenSection
              isExpanded={
                expandedSections.children
              }
              onToggle={() =>
                toggleSection("children")
              }
            />

            <DefendantSection
              isExpanded={
                expandedSections.defendant
              }
              onToggle={() =>
                toggleSection("defendant")
              }
            />

            <RelationshipSection
              isExpanded={
                expandedSections.relationship
              }
              onToggle={() =>
                toggleSection("relationship")
              }
            />

            <LegalStatusSection
              isExpanded={
                expandedSections.legalStatus
              }
              onToggle={() =>
                toggleSection("legalStatus")
              }
            />

            <AbuseSection
              isExpanded={expandedSections.abuse}
              onToggle={() =>
                toggleSection("abuse")
              }
            />

            <FirearmsSection
              isExpanded={
                expandedSections.firearms
              }
              onToggle={() =>
                toggleSection("firearms")
              }
            />

            <IncidentSection
              isExpanded={
                expandedSections.incident
              }
              onToggle={() =>
                toggleSection("incident")
              }
            />

            <ReliefSection
              isExpanded={expandedSections.relief}
              onToggle={() =>
                toggleSection("relief")
              }
            />

            <PropertySection
              isExpanded={
                expandedSections.property
              }
              onToggle={() =>
                toggleSection("property")
              }
            />

            <CustodySection
              isExpanded={
                expandedSections.custody
              }
              onToggle={() =>
                toggleSection("custody")
              }
            />

            <WitnessSection
              isExpanded={
                expandedSections.witness
              }
              onToggle={() =>
                toggleSection("witness")
              }
            />

            <AffirmationSection
              isExpanded={
                expandedSections.affirmation
              }
              onToggle={() =>
                toggleSection("affirmation")
              }
            />

            {/* TODO: Add remaining sections:
              - Accommodations (interpreter needs)
              - Venue (where to file)
              - Relationship
              - Legal Status (divorce, custody)
              - Abuse Details
              - Danger Assessment
              - Firearms
              - Incidents
              - Relief Requested
              - Property
              - Custody
              - Financial
              - Requirements
              - Witnesses
              - Court
              - Service
              - Affirmation
            */}

            {/* Progress Indicator */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Form Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                More sections will be added as we
                continue development. Currently
                showing 5 of 15 sections.
              </p>
            </div>

            {/* Submit Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="final-confirmation"
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    required
                  />
                  <label
                    htmlFor="final-confirmation"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    I swear that everything in
                    this petition is true to the
                    best of my knowledge. I
                    understand that lying on this
                    form is perjury, a crime
                    punishable by law.
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={!isFormComplete}
                    className={`px-6 py-3 font-medium rounded transition-colors ${
                      isFormComplete
                        ? "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Generate Protection Order
                    Forms
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure? This will clear all information you've entered.",
                        )
                      ) {
                        resetForm();
                      }
                    }}
                    className="px-6 py-3 font-medium rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Louisiana Bar Association • Domestic
              Violence Protection Order Intake
            </p>
          </div>
        </div>

        {/* PDF Download Modal */}
        <PDFDownloadModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
};
