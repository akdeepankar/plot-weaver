// User preferences and personalization system
export interface UserPreferences {
  // Basic profile
  archetype: 'explorer' | 'philosopher' | 'survivor' | 'caregiver' | null;
  name?: string;
  age?: number;
  readingLevel?: 'beginner' | 'intermediate' | 'advanced';
  
  // Story preferences
  preferredGenres: string[];
  storyLength: 'short' | 'medium' | 'long';
  writingStyle: 'simple' | 'descriptive' | 'poetic' | 'conversational';
  emotionalTone: 'light' | 'neutral' | 'dark' | 'uplifting';
  includeRomance: boolean;
  includeAction: boolean;
  includeMystery: boolean;
  includeFantasy: boolean;
  
  // Reading preferences
  readingSpeed: 'slow' | 'normal' | 'fast';
  preferEmojis: boolean;
  preferChapters: boolean;
  maxParagraphsPerSession: number;
  
  // Content preferences
  favoriteCharacters: string[];
  favoriteSettings: string[];
  avoidTopics: string[];
  
  // UI preferences
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  animationSpeed: 'slow' | 'normal' | 'fast';
  
  // Learning preferences
  wantEducationalContent: boolean;
  preferredLanguages: string[];
  culturalBackground?: string;
  
  // Interaction preferences
  wantStorySuggestions: boolean;
  wantCharacterDevelopment: boolean;
  wantPlotTwists: boolean;
  wantHappyEndings: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  archetype: null,
  preferredGenres: [],
  storyLength: 'medium',
  writingStyle: 'descriptive',
  emotionalTone: 'neutral',
  includeRomance: false,
  includeAction: true,
  includeMystery: false,
  includeFantasy: true,
  readingSpeed: 'normal',
  preferEmojis: true,
  preferChapters: false,
  maxParagraphsPerSession: 3,
  favoriteCharacters: [],
  favoriteSettings: [],
  avoidTopics: [],
  theme: 'light',
  fontSize: 'medium',
  animationSpeed: 'normal',
  wantEducationalContent: false,
  preferredLanguages: ['en'],
  wantStorySuggestions: true,
  wantCharacterDevelopment: true,
  wantPlotTwists: true,
  wantHappyEndings: true,
};

export class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user-preferences';
  
  static getPreferences(): UserPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    
    try {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }
  
  static updatePreferences(updates: Partial<UserPreferences>): void {
    if (typeof window === 'undefined') return;
    
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }
  
  static resetPreferences(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  static getArchetype(): string | null {
    return this.getPreferences().archetype;
  }
  
  static setArchetype(archetype: string): void {
    this.updatePreferences({ archetype: archetype as any });
  }
  
  static getStoryPromptEnhancement(): string {
    const prefs = this.getPreferences();
    let enhancement = '';
    
    // Add genre preferences
    if (prefs.preferredGenres.length > 0) {
      enhancement += ` Include elements of: ${prefs.preferredGenres.join(', ')}.`;
    }
    
    // Add writing style
    enhancement += ` Write in a ${prefs.writingStyle} style.`;
    
    // Add emotional tone
    enhancement += ` Maintain a ${prefs.emotionalTone} tone.`;
    
    // Add content preferences
    if (prefs.includeRomance) enhancement += ' Include romantic elements.';
    if (prefs.includeAction) enhancement += ' Include action scenes.';
    if (prefs.includeMystery) enhancement += ' Include mystery elements.';
    if (prefs.includeFantasy) enhancement += ' Include fantasy elements.';
    
    // Add character preferences
    if (prefs.favoriteCharacters.length > 0) {
      enhancement += ` Include characters similar to: ${prefs.favoriteCharacters.join(', ')}.`;
    }
    
    // Add setting preferences
    if (prefs.favoriteSettings.length > 0) {
      enhancement += ` Set in environments like: ${prefs.favoriteSettings.join(', ')}.`;
    }
    
    // Add avoid topics
    if (prefs.avoidTopics.length > 0) {
      enhancement += ` Avoid topics: ${prefs.avoidTopics.join(', ')}.`;
    }
    
    return enhancement;
  }
} 