# LPOR-F Form - Embedding Guide

This guide shows you how to embed the LPOR-F (Louisiana Petition for Protection from Abuse - Confidential Address Form) on your website.

## 🚀 Quick Start

Add this iframe to your HTML:

```html
<iframe 
  src="https://your-domain.com/en/lpor_f"
  width="100%"
  height="1000"
  style="border: none;"
  title="LPOR-F Form">
</iframe>
```

## 📋 URL Parameters

Pre-populate court information by adding query parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `court` | Court name | `Caddo%20Parish%20Court` |
| `parishCity` | Parish or city | `Caddo%20Parish` |
| `division` | Court division | `A`, `B`, `C` |
| `number` | Docket/case number | `2024-CV-12345` |
| `filed` | Filing date (YYYY-MM-DD) | `2024-10-16` |
| `clerk` | Clerk name | `John%20Doe` |

### Example with Parameters:

```html
<iframe 
  src="https://your-domain.com/en/lpor_f?court=Jefferson%20Parish&number=2024-CV-001&division=B&filed=2024-10-16&clerk=Jane%20Smith"
  width="100%"
  height="1000"
  style="border: none;"
  title="LPOR-F Form">
</iframe>
```

## 🌍 Language Support

Change the language by modifying the URL path:

- **English**: `/en/lpor_f`
- **Spanish**: `/es/lpor_f`
- **French**: `/fr/lpor_f`

Example in Spanish:
```html
<iframe 
  src="https://your-domain.com/es/lpor_f?court=Tribunal%20Test"
  width="100%"
  height="1000"
  title="Formulario LPOR-F">
</iframe>
```

## 📱 Responsive Sizing

### Desktop
```html
<iframe 
  src="https://your-domain.com/en/lpor_f"
  width="100%"
  height="1000"
  style="border: none;">
</iframe>
```

### Mobile-Optimized
```html
<style>
  .form-container iframe {
    width: 100%;
    height: 1000px;
    border: none;
  }
  
  @media (max-width: 768px) {
    .form-container iframe {
      height: 1200px; /* More height for mobile scrolling */
    }
  }
</style>

<div class="form-container">
  <iframe 
    src="https://your-domain.com/en/lpor_f"
    title="LPOR-F Form">
  </iframe>
</div>
```

## 🎨 Styling Options

### Bordered Container
```html
<iframe 
  src="https://your-domain.com/en/lpor_f"
  width="100%"
  height="1000"
  style="border: 2px solid #ccc; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
</iframe>
```

### Fixed Width Centered
```html
<div style="max-width: 800px; margin: 0 auto;">
  <iframe 
    src="https://your-domain.com/en/lpor_f"
    width="100%"
    height="1000"
    style="border: none;">
  </iframe>
</div>
```

## ✨ Features

- ✅ **Dark Mode**: Automatically detects system preferences
- ✅ **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- ✅ **Voice Input**: Speech-to-text for text fields
- ✅ **Multi-Language**: English, Spanish, French
- ✅ **Privacy**: No cookies, no tracking, client-side PDF generation
- ✅ **Responsive**: Works on mobile, tablet, and desktop
- ✅ **Validation**: Real-time form validation with error messages

## 🔒 Security & Privacy

- No cookies used
- No localStorage used
- No data sent to servers
- PDF generated client-side in the browser
- Complete isolation via iframe sandbox

## 🧪 Testing

View the interactive demo at:
```
http://localhost:5173/embed-demo.html
```

Or in production:
```
https://your-domain.com/embed-demo.html
```

## 📏 Recommended Heights

- **Basic form**: 1000px
- **With many sections filled**: 1200px
- **Mobile devices**: 1200-1400px
- **Compact widget**: 800px (may require scrolling)

## 🛠️ Development Mode

For testing, add `?debug=true` to show the "Populate Test Data" button:

```html
<iframe 
  src="http://localhost:5173/en/lpor_f?debug=true"
  width="100%"
  height="1000">
</iframe>
```

## 💡 Best Practices

1. **Always set a `title` attribute** for accessibility
2. **Use `loading="lazy"`** for better page performance
3. **Set explicit width and height** to prevent layout shifts
4. **URL encode parameter values** (spaces = %20)
5. **Test on multiple devices** and screen sizes

## 🆘 Support

For issues or questions:
- Check the [embed demo](https://your-domain.com/embed-demo.html) for examples
- Review [URL_PARAMETERS.md](../URL_PARAMETERS.md) for parameter details
- Contact: [your contact method]

## 📄 License

[Your License Here]
