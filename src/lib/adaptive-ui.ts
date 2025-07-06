import { UserPreferences } from './user-preferences';

export class AdaptiveUI {
  static getThemeBasedOnContext(preferences: UserPreferences): any {
    const timeOfDay = preferences.timeOfDay;
    const energyLevel = preferences.energyLevel;
    const stressLevel = preferences.stressLevel;
    
    // Adaptive color schemes based on user state
    const themes = {
      morning: {
        primary: 'text-orange-600',
        accent: 'bg-orange-50',
        button: 'bg-orange-600 hover:bg-orange-700',
        background: 'bg-gradient-to-br from-orange-50 to-yellow-50'
      },
      afternoon: {
        primary: 'text-blue-600',
        accent: 'bg-blue-50',
        button: 'bg-blue-600 hover:bg-blue-700',
        background: 'bg-gradient-to-br from-blue-50 to-indigo-50'
      },
      evening: {
        primary: 'text-purple-600',
        accent: 'bg-purple-50',
        button: 'bg-purple-600 hover:bg-purple-700',
        background: 'bg-gradient-to-br from-purple-50 to-pink-50'
      },
      night: {
        primary: 'text-indigo-600',
        accent: 'bg-indigo-50',
        button: 'bg-indigo-600 hover:bg-indigo-700',
        background: 'bg-gradient-to-br from-indigo-50 to-gray-50'
      }
    };
    
    // Adjust based on energy and stress levels
    let theme = themes[timeOfDay as keyof typeof themes];
    
    if (energyLevel === 'low') {
      theme = { ...theme, background: 'bg-gradient-to-br from-gray-50 to-slate-50' };
    }
    
    if (stressLevel === 'high') {
      theme = { ...theme, background: 'bg-gradient-to-br from-green-50 to-emerald-50' };
    }
    
    return theme;
  }
  
  static getInteractionStyle(preferences: UserPreferences): any {
    const style = preferences.interactionStyle;
    
    return {
      minimal: {
        showAnimations: false,
        showTutorials: false,
        showProgress: false,
        compactLayout: true
      },
      guided: {
        showAnimations: true,
        showTutorials: true,
        showProgress: true,
        compactLayout: false
      },
      immersive: {
        showAnimations: true,
        showTutorials: true,
        showProgress: true,
        compactLayout: false,
        fullScreenMode: true
      }
    }[style];
  }
  
  static getAccessibilitySettings(preferences: UserPreferences): any {
    const accessibility = preferences.accessibility;
    
    return {
      highContrast: accessibility.highContrast,
      reducedMotion: accessibility.reducedMotion,
      screenReader: accessibility.screenReader,
      dyslexiaFriendly: accessibility.dyslexiaFriendly,
      fontSize: accessibility.dyslexiaFriendly ? 'large' : preferences.textSize,
      lineSpacing: accessibility.dyslexiaFriendly ? 'loose' : 'normal',
      fontFamily: accessibility.dyslexiaFriendly ? 'OpenDyslexic' : 'default'
    };
  }
  
  static getContentComplexity(preferences: UserPreferences): any {
    const complexity = preferences.complexity;
    const readingSpeed = preferences.readingSpeed;
    
    return {
      simple: {
        sentenceLength: 'short',
        vocabularyLevel: 'basic',
        paragraphLength: 'short',
        readingPace: 'slow'
      },
      moderate: {
        sentenceLength: 'medium',
        vocabularyLevel: 'intermediate',
        paragraphLength: 'medium',
        readingPace: 'normal'
      },
      complex: {
        sentenceLength: 'long',
        vocabularyLevel: 'advanced',
        paragraphLength: 'long',
        readingPace: 'fast'
      }
    }[complexity];
  }
} 