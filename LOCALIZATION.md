# Localization with Lingo.dev

This app has been integrated with Lingo.dev for multi-language support. Here's how to use it:

## Setup

1. **Get a Lingo.dev API Key**
   - Sign up at [lingo.dev](https://lingo.dev)
   - Get your API key from the dashboard

2. **Add API Key to Environment**
   ```bash
   # Add to your .env.local file
   NEXT_PUBLIC_LINGO_API_KEY=your-lingo-api-key-here
   ```

## Features

### Language Selector
- Located in the top-right corner of the navbar
- Supports 10 languages: English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese, Arabic
- Click to change language instantly

### Translation System
- All UI text is automatically translated
- Quiz questions and options are localized
- Story content and navigation elements are translated
- Caching system prevents repeated API calls

## How It Works

### 1. Localization Hook
```typescript
import { useLocalization } from "@/lib/localization";

function MyComponent() {
  const { locale, setLocale, t } = useLocalization();
  
  return (
    <div>
      <h1>{t('quiz.title')}</h1>
      <p>{t('quiz.welcome')}</p>
    </div>
  );
}
```

### 2. Translation Function
```typescript
// Simple translation
t('quiz.title') // Returns: "🎭 PlotWeaver"

// With parameters
t('quiz.questionOf', { current: 1, total: 5 }) // Returns: "Question 1 of 5"
```

### 3. Object Translation
```typescript
const { translateObject } = useLocalization();

const content = {
  greeting: "Hello",
  farewell: "Goodbye"
};

const translated = await translateObject(content);
// Returns: { greeting: "Hola", farewell: "Adiós" }
```

## API Usage

### Server-Side API Call (Recommended)
```typescript
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGO_API_KEY,
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
// Returns: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

### Client-Side API Route
```typescript
// Use the API route from client-side
const response = await fetch('/api/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: { greeting: "Hello" },
    sourceLocale: "en",
    targetLocale: "es"
  })
});

const { translated } = await response.json();
```

### API Route
```typescript
// POST /api/translate
const response = await fetch('/api/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: { greeting: "Hello" },
    sourceLocale: "en",
    targetLocale: "es"
  })
});

const { translated } = await response.json();
```

## Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| es | Spanish | Español |
| fr | French | Français |
| de | German | Deutsch |
| it | Italian | Italiano |
| pt | Portuguese | Português |
| ja | Japanese | 日本語 |
| ko | Korean | 한국어 |
| zh | Chinese | 中文 |
| ar | Arabic | العربية |

## Adding New Content

To add new translatable content:

1. **Add to localization content** in `src/lib/localization.ts`:
```typescript
export const LOCALIZATION_CONTENT = {
  // ... existing content
  newSection: {
    title: "New Title",
    description: "New description"
  }
};
```

2. **Use in components**:
```typescript
const { t } = useLocalization();
return <h1>{t('newSection.title')}</h1>;
```

## Caching

The app includes a caching system that:
- Stores translated content in memory
- Prevents duplicate API calls
- Improves performance for repeated translations

## Error Handling

- If translation fails, the app falls back to English
- API errors are logged to console
- UI gracefully handles missing translations

## Performance Tips

1. **Batch translations** when possible
2. **Use the cache** - translations are cached automatically
3. **Preload common content** for better UX
4. **Monitor API usage** in your Lingo.dev dashboard 