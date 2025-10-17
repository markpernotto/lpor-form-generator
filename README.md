# 🏛️ LPOR Form Generator

Louisiana Petition for Protection from Abuse - Confidential Address Form

A modern, accessible, multilingual web application for generating LPOR-F forms with PDF export capabilities. Built with React, TypeScript, and Tailwind CSS.

There is only one form currently, Form F, that is meant to generate this PDF document, in a filled out form: https://www.lasc.org/court_managed_prog/LPOR/lpor_forms/Lpor_F.pdf

## ✨ Features

- 🌍 **Multi-Language Support** - English, Spanish, and French
- 🎨 **Dark Mode** - Automatic system preference detection with manual toggle
- ♿ **WCAG 2.1 AA Compliant** - Full accessibility with ARIA labels and keyboard navigation
- 🎤 **Voice Input** - Speech-to-text support for text fields
- 📄 **Client-Side PDF Generation** - No server required, privacy-first approach
- 🔗 **URL Parameter Pre-population** - Pre-fill court information via query parameters
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- 🚀 **Embeddable** - Easy iframe integration for other websites

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/markpernotto/lpor-form-generator.git
   cd lpor-form-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```
   Production files will be in the `dist/` directory

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 📚 Documentation

### Quick Links

- 🎯 **[Live Demo & Embedding Guide](https://victorious-forest-0c177cc0f.2.azurestaticapps.net/embed-demo.html)** - Interactive examples and implementation instructions
- 🔗 **[URL Parameters Documentation](./URL_PARAMETERS.md)** - Guide to pre-populating form fields via URL
- 🎨 **[Embedding Guide](./EMBEDDING.md)** - How to embed the form on your website
- ♿ **[Accessibility Documentation](./ACCESSIBILITY.md)** - WCAG compliance and accessibility features

### Live Application

The application is deployed at: **[https://victorious-forest-0c177cc0f.2.azurestaticapps.net](https://victorious-forest-0c177cc0f.2.azurestaticapps.net)**

Direct form links:
- English: `https://victorious-forest-0c177cc0f.2.azurestaticapps.net/en/lpor_f`
- Spanish: `https://victorious-forest-0c177cc0f.2.azurestaticapps.net/es/lpor_f`
- French: `https://victorious-forest-0c177cc0f.2.azurestaticapps.net/fr/lpor_f`

## 🎨 Embedding the Form

You can easily embed this form on your website using an iframe:

```html
<iframe 
  src="https://victorious-forest-0c177cc0f.2.azurestaticapps.net/en/lpor_f?widget=true"
  width="100%"
  height="1000"
  style="border: none;"
  title="LPOR-F Form">
</iframe>
```

**Pre-populate court information:**
```html
<iframe 
  src="https://victorious-forest-0c177cc0f.2.azurestaticapps.net/en/lpor_f?widget=true&court=Orleans%20Parish%20Court&number=2024-12345&division=A"
  width="100%"
  height="1000"
  style="border: none;"
  title="LPOR-F Form">
</iframe>
```

For more examples and implementation details, see the **[Live Demo & Embedding Guide](https://victorious-forest-0c177cc0f.2.azurestaticapps.net/embed-demo.html)**.

## 🔧 Technology Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v3
- **PDF Generation:** pdf-lib (client-side)
- **Internationalization:** Custom i18n system
- **Hosting:** Azure Static Web Apps

## 🌐 URL Parameters

The form supports pre-populating court information via URL parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `widget` | Enable widget mode (hides navigation) | `true` |
| `court` | Court name | `Orleans%20Parish%20Court` |
| `parishCity` | Parish or city name | `New%20Orleans` |
| `division` | Court division | `A`, `B`, `C` |
| `number` | Docket/case number | `2024-CV-12345` |
| `filed` | Filing date | `2024-10-16` |
| `clerk` | Clerk name | `John%20Smith` |
| `debug` | Show test data button | `true` |

**Example:**
```
https://victorious-forest-0c177cc0f.2.azurestaticapps.net/en/lpor_f?widget=true&court=Caddo%20Parish%20Court&number=2024-12345&division=A
```

See [URL_PARAMETERS.md](./URL_PARAMETERS.md) for complete documentation.

## ♿ Accessibility

This application is built with accessibility as a core principle:

- ✅ WCAG 2.1 Level AA compliant
- ✅ Full keyboard navigation support
- ✅ Screen reader optimized with ARIA labels
- ✅ Voice input for text fields (Web Speech API)
- ✅ High contrast mode support
- ✅ Focus management and indicators
- ✅ Semantic HTML structure

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for detailed accessibility features and testing information.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


