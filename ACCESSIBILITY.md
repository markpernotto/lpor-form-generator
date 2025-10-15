# Accessibility Improvements for LPOR Form Generator

## Current Accessibility Issues & Solutions

### 1. **Form Structure & Navigation**

#### Issues:
- Missing form landmarks
- No skip links for keyboard navigation
- Form sections not properly grouped
- No progress indicator

#### Solutions:
```jsx
// Add to LPORFForm.tsx
<main role="main" aria-labelledby="form-title">
  <h1 id="form-title" className="sr-only">LPOR F Confidential Address Form</h1>
  
  {/* Skip link for keyboard users */}
  <a 
    href="#form-content" 
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-2 rounded"
  >
    Skip to form content
  </a>

  {/* Progress indicator */}
  <nav aria-label="Form progress">
    <ol className="flex items-center space-x-4 mb-6">
      <li className="flex items-center text-blue-600">
        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
        <span className="ml-2">Petitioner Information</span>
      </li>
      {/* More steps... */}
    </ol>
  </nav>
</main>
```

### 2. **Form Fields Improvements**

#### Current Issues:
- Required fields not clearly indicated to screen readers
- Error messages not associated with fields
- No field descriptions for complex inputs
- Missing autocomplete attributes

#### Recommended Changes:
Replace standard inputs with `AccessibleInput` component:

```jsx
// Instead of:
<input type="text" value={formData.petitioner.firstName} />

// Use:
<AccessibleInput
  id="petitioner-first-name"
  label="First Name"
  value={formData.petitioner.firstName}
  onChange={(value) => handleInputChange('petitioner.firstName', value)}
  required={true}
  autoComplete="given-name"
  helpText="Enter your legal first name as it appears on official documents"
  enableVoiceInput={true}
/>
```

### 3. **Widget Context Considerations**

#### For Widget Implementation:
```jsx
// Add widget-specific accessibility features
<div 
  role="dialog" 
  aria-labelledby="widget-title"
  aria-describedby="widget-description"
  className="widget-container focus:outline-none"
  tabIndex={-1}
>
  <div className="widget-header">
    <h2 id="widget-title">Legal Form Assistant</h2>
    <p id="widget-description" className="sr-only">
      Complete this form to generate your legal document
    </p>
    <button 
      onClick={closeWidget}
      aria-label="Close form widget"
      className="close-button"
    >
      ×
    </button>
  </div>
  
  {/* Form content */}
  <div className="widget-content" style={{maxHeight: '400px', overflowY: 'auto'}}>
    <LPORFForm />
  </div>
</div>
```

### 4. **Keyboard Navigation**

#### Improvements Needed:
```jsx
// Add keyboard navigation handlers
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    // Close widget or return to previous section
  }
  
  if (e.ctrlKey && e.key === 'Enter') {
    // Quick submit for power users
    handleSubmit();
  }
};

// Focus management for sections
const sectionRefs = useRef<(HTMLElement | null)[]>([]);

const focusSection = (index: number) => {
  sectionRefs.current[index]?.focus();
};
```

### 5. **Screen Reader Enhancements**

#### Live Regions for Dynamic Content:
```jsx
// Add live region for status updates
<div 
  aria-live="polite" 
  aria-atomic="true" 
  className="sr-only"
>
  {statusMessage}
</div>

// Announce form progress
<div 
  aria-live="polite" 
  className="sr-only"
>
  {currentSection && `Now on ${currentSection} section`}
</div>
```

### 6. **Color & Visual Accessibility**

#### Current Issues:
- May not meet WCAG contrast ratios
- Color-only error indication

#### Solutions:
```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  .form-input {
    border-width: 2px;
    border-color: #000;
  }
  
  .error-input {
    border-color: #d00;
    background-color: #fff5f5;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .transition-all {
    transition: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .form-container {
    background-color: #1a1a1a;
    color: #fff;
  }
}
```

## Quick Implementation Priority

### **High Priority (Implement First):**
1. ✅ Add proper form labels and descriptions
2. ✅ Implement error message associations
3. ✅ Add required field indicators
4. ✅ Include autocomplete attributes
5. ✅ Add voice input capability

### **Medium Priority:**
1. Focus management and keyboard navigation
2. Skip links and landmarks
3. Progress indicators
4. Live regions for status updates

### **Widget-Specific Priority:**
1. Modal/dialog ARIA attributes
2. Focus trapping within widget
3. Escape key handling
4. Proper focus restoration when closing

## Testing Recommendations

### **Screen Reader Testing:**
- NVDA (Windows) - Free
- JAWS (Windows) - Most popular
- VoiceOver (macOS) - Built-in
- Orca (Linux) - Free

### **Automated Testing:**
```bash
# Add accessibility testing
npm install --save-dev @axe-core/react jest-axe

# Test with:
npm install --save-dev cypress cypress-axe
```

### **Manual Testing:**
1. Tab through entire form
2. Use only keyboard (no mouse)
3. Test with screen reader
4. Check color contrast
5. Test at 200% zoom level

Would you like me to implement any of these specific improvements to the LPOR F form?