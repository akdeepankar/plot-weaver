import { UserPreferencesManager } from './user-preferences';

export interface PersonalizedStoryConfig {
  archetype: string;
  writingStyle: string;
  emotionalTone: string;
  storyLength: string;
  includeElements: string[];
  avoidTopics: string[];
  characterTypes: string[];
  settings: string[];
  readingLevel: string;
  maxParagraphs: number;
}

export class StoryPersonalization {
  static getPersonalizedPrompt(basePrompt: string, archetype?: string): string {
    const prefs = UserPreferencesManager.getPreferences();
    const archetypeToUse = archetype || prefs.archetype;
    
    let enhancedPrompt = basePrompt;
    
    // Add archetype-specific enhancements
    if (archetypeToUse) {
      enhancedPrompt += `\n\nWrite this story in the style that appeals to a ${archetypeToUse} personality type.`;
      
      switch (archetypeToUse) {
        case 'explorer':
          enhancedPrompt += ' Focus on adventure, discovery, and exploration. Include vivid descriptions of new places and experiences.';
          break;
        case 'philosopher':
          enhancedPrompt += ' Include deeper themes, moral questions, and philosophical elements. Use rich metaphors and layered meaning.';
          break;
        case 'survivor':
          enhancedPrompt += ' Emphasize resilience, overcoming challenges, and realistic struggles. Include moments of triumph over adversity.';
          break;
        case 'caregiver':
          enhancedPrompt += ' Focus on relationships, empathy, and helping others. Include warm, nurturing moments and emotional connections.';
          break;
      }
    }
    
    // Add writing style
    enhancedPrompt += `\n\nWriting style: ${prefs.writingStyle}`;
    
    // Add emotional tone
    enhancedPrompt += `\n\nEmotional tone: ${prefs.emotionalTone}`;
    
    // Add content elements
    const elements = [];
    if (prefs.includeRomance) elements.push('romantic elements');
    if (prefs.includeAction) elements.push('action scenes');
    if (prefs.includeMystery) elements.push('mystery elements');
    if (prefs.includeFantasy) elements.push('fantasy elements');
    
    if (elements.length > 0) {
      enhancedPrompt += `\n\nInclude: ${elements.join(', ')}`;
    }
    
    // Add character preferences
    if (prefs.favoriteCharacters.length > 0) {
      enhancedPrompt += `\n\nInclude characters similar to: ${prefs.favoriteCharacters.join(', ')}`;
    }
    
    // Add setting preferences
    if (prefs.favoriteSettings.length > 0) {
      enhancedPrompt += `\n\nSet in environments like: ${prefs.favoriteSettings.join(', ')}`;
    }
    
    // Add avoid topics
    if (prefs.avoidTopics.length > 0) {
      enhancedPrompt += `\n\nAvoid: ${prefs.avoidTopics.join(', ')}`;
    }
    
    // Add reading level adjustments
    switch (prefs.readingLevel) {
      case 'beginner':
        enhancedPrompt += '\n\nUse simple vocabulary and short sentences suitable for beginners.';
        break;
      case 'advanced':
        enhancedPrompt += '\n\nUse sophisticated vocabulary and complex sentence structures suitable for advanced readers.';
        break;
    }
    
    // Add story length guidance
    switch (prefs.storyLength) {
      case 'short':
        enhancedPrompt += '\n\nKeep the story concise and focused.';
        break;
      case 'long':
        enhancedPrompt += '\n\nDevelop the story with rich detail and multiple plot threads.';
        break;
    }
    
    return enhancedPrompt;
  }
  
  static getPersonalizedStoryOptions(storyContext: string): string[] {
    const prefs = UserPreferencesManager.getPreferences();
    const archetype = prefs.archetype;
    
    const baseOptions = [
      "Continue with more action and excitement",
      "Focus on character development and relationships",
      "Add a surprising plot twist",
      "Explore the setting in more detail",
      "Introduce a new character",
      "Create a moment of tension or conflict",
      "Show a moment of triumph or success",
      "Add a philosophical or reflective moment"
    ];
    
    // Filter options based on archetype preferences
    if (archetype === 'explorer') {
      return baseOptions.filter(option => 
        option.includes('action') || 
        option.includes('setting') || 
        option.includes('new character') ||
        option.includes('excitement')
      );
    } else if (archetype === 'philosopher') {
      return baseOptions.filter(option => 
        option.includes('philosophical') || 
        option.includes('character development') ||
        option.includes('reflective')
      );
    } else if (archetype === 'survivor') {
      return baseOptions.filter(option => 
        option.includes('tension') || 
        option.includes('conflict') || 
        option.includes('triumph') ||
        option.includes('action')
      );
    } else if (archetype === 'caregiver') {
      return baseOptions.filter(option => 
        option.includes('relationships') || 
        option.includes('character development') ||
        option.includes('triumph')
      );
    }
    
    return baseOptions;
  }
  
  static getPersonalizedParagraphCount(): number {
    const prefs = UserPreferencesManager.getPreferences();
    return prefs.maxParagraphsPerSession;
  }
  
  static shouldIncludeEmojis(): boolean {
    const prefs = UserPreferencesManager.getPreferences();
    return prefs.preferEmojis;
  }
  
  static getPersonalizedTheme(archetype: string) {
    const themes = {
      explorer: {
        primary: 'text-blue-600',
        accent: 'bg-blue-50',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700',
        gradient: 'from-blue-500 to-cyan-500'
      },
      philosopher: {
        primary: 'text-purple-600',
        accent: 'bg-purple-50',
        border: 'border-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700',
        gradient: 'from-purple-500 to-indigo-500'
      },
      survivor: {
        primary: 'text-red-600',
        accent: 'bg-red-50',
        border: 'border-red-200',
        button: 'bg-red-600 hover:bg-red-700',
        gradient: 'from-red-500 to-orange-500'
      },
      caregiver: {
        primary: 'text-green-600',
        accent: 'bg-green-50',
        border: 'border-green-200',
        button: 'bg-green-600 hover:bg-green-700',
        gradient: 'from-green-500 to-emerald-500'
      }
    };
    
    return themes[archetype as keyof typeof themes] || themes.explorer;
  }
} 