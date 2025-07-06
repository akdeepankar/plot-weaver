import { UserPreferences } from './user-preferences';

export interface UserBehavior {
  storyInteractions: {
    storyId: string;
    timeSpent: number;
    completionRate: number;
    engagementScore: number;
    timestamp: Date;
  }[];
  preferences: {
    genre: string;
    theme: string;
    complexity: string;
    sessionLength: string;
    timestamp: Date;
  }[];
  emotionalResponses: {
    emotion: string;
    intensity: number;
    trigger: string;
    timestamp: Date;
  }[];
  usagePatterns: {
    timeOfDay: string;
    deviceType: string;
    sessionDuration: number;
    frequency: string;
    timestamp: Date;
  }[];
}

export class ProgressivePersonalization {
  private static readonly BEHAVIOR_KEY = 'user-behavior-data';
  
  static trackStoryInteraction(storyId: string, timeSpent: number, completionRate: number, engagementScore: number): void {
    const behavior = this.getBehaviorData();
    
    behavior.storyInteractions.push({
      storyId,
      timeSpent,
      completionRate,
      engagementScore,
      timestamp: new Date()
    });
    
    this.saveBehaviorData(behavior);
  }
  
  static trackPreference(genre: string, theme: string, complexity: string, sessionLength: string): void {
    const behavior = this.getBehaviorData();
    
    behavior.preferences.push({
      genre,
      theme,
      complexity,
      sessionLength,
      timestamp: new Date()
    });
    
    this.saveBehaviorData(behavior);
  }
  
  static trackEmotionalResponse(emotion: string, intensity: number, trigger: string): void {
    const behavior = this.getBehaviorData();
    
    behavior.emotionalResponses.push({
      emotion,
      intensity,
      trigger,
      timestamp: new Date()
    });
    
    this.saveBehaviorData(behavior);
  }
  
  static trackUsagePattern(timeOfDay: string, deviceType: string, sessionDuration: number, frequency: string): void {
    const behavior = this.getBehaviorData();
    
    behavior.usagePatterns.push({
      timeOfDay,
      deviceType,
      sessionDuration,
      frequency,
      timestamp: new Date()
    });
    
    this.saveBehaviorData(behavior);
  }
  
  static getPersonalizedRecommendations(): any {
    const behavior = this.getBehaviorData();
    const recommendations = {
      preferredGenres: this.getPreferredGenres(behavior),
      optimalSessionLength: this.getOptimalSessionLength(behavior),
      bestTimeOfDay: this.getBestTimeOfDay(behavior),
      emotionalTriggers: this.getEmotionalTriggers(behavior),
      complexityLevel: this.getOptimalComplexity(behavior)
    };
    
    return recommendations;
  }
  
  static updateUserPreferences(): UserPreferences {
    const behavior = this.getBehaviorData();
    const currentPrefs = this.getCurrentPreferences();
    
    // Update preferences based on behavior patterns
    const updatedPrefs = {
      ...currentPrefs,
      genrePreferences: this.getPreferredGenres(behavior),
      sessionLength: this.getOptimalSessionLength(behavior),
      timeOfDay: this.getBestTimeOfDay(behavior),
      complexity: this.getOptimalComplexity(behavior),
      deviceType: this.getMostUsedDevice(behavior)
    };
    
    return updatedPrefs;
  }
  
  private static getBehaviorData(): UserBehavior {
    if (typeof window === 'undefined') {
      return {
        storyInteractions: [],
        preferences: [],
        emotionalResponses: [],
        usagePatterns: []
      };
    }
    
    const stored = localStorage.getItem(this.BEHAVIOR_KEY);
    if (!stored) {
      return {
        storyInteractions: [],
        preferences: [],
        emotionalResponses: [],
        usagePatterns: []
      };
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      return {
        storyInteractions: [],
        preferences: [],
        emotionalResponses: [],
        usagePatterns: []
      };
    }
  }
  
  private static saveBehaviorData(behavior: UserBehavior): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.BEHAVIOR_KEY, JSON.stringify(behavior));
  }
  
  private static getCurrentPreferences(): UserPreferences {
    // This would integrate with your existing UserPreferencesManager
    return {
      archetype: null,
      readingSpeed: 'normal',
      textSize: 'medium',
      readingTime: 'medium',
      complexity: 'moderate',
      genrePreferences: [],
      themes: [],
      avoidTopics: [],
      favoriteCharacters: [],
      interactionStyle: 'guided',
      notificationPreferences: {
        storyReminders: true,
        newFeatures: true,
        progressUpdates: true,
      },
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        screenReader: false,
        dyslexiaFriendly: false,
      },
      learningStyle: 'reading',
      difficultyProgression: 'adaptive',
      timeOfDay: 'afternoon',
      energyLevel: 'medium',
      stressLevel: 'low',
      culturalBackground: [],
      languageStyle: 'casual',
      deviceType: 'desktop',
      environment: 'quiet',
      sessionLength: 'moderate',
      frequency: 'weekly',
      emotionalState: {
        current: 'neutral',
        triggers: [],
        copingStrategies: [],
      },
    };
  }
  
  private static getPreferredGenres(behavior: UserBehavior): string[] {
    const genreCounts = behavior.preferences.reduce((acc, pref) => {
      acc[pref.genre] = (acc[pref.genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);
  }
  
  private static getOptimalSessionLength(behavior: UserBehavior): string {
    const sessionLengths = behavior.usagePatterns.map(p => p.sessionDuration);
    const avgSession = sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length;
    
    if (avgSession < 5) return 'quick';
    if (avgSession < 15) return 'moderate';
    return 'extended';
  }
  
  private static getBestTimeOfDay(behavior: UserBehavior): string {
    const timeCounts = behavior.usagePatterns.reduce((acc, pattern) => {
      acc[pattern.timeOfDay] = (acc[pattern.timeOfDay] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(timeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'afternoon';
  }
  
  private static getEmotionalTriggers(behavior: UserBehavior): string[] {
    return behavior.emotionalResponses
      .filter(response => response.intensity > 0.7)
      .map(response => response.trigger)
      .filter((trigger, index, arr) => arr.indexOf(trigger) === index);
  }
  
  private static getOptimalComplexity(behavior: UserBehavior): string {
    const complexityCounts = behavior.preferences.reduce((acc, pref) => {
      acc[pref.complexity] = (acc[pref.complexity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const total = Object.values(complexityCounts).reduce((a, b) => a + b, 0);
    const simpleRatio = (complexityCounts.simple || 0) / total;
    const complexRatio = (complexityCounts.complex || 0) / total;
    
    if (simpleRatio > 0.6) return 'simple';
    if (complexRatio > 0.6) return 'complex';
    return 'moderate';
  }
  
  private static getMostUsedDevice(behavior: UserBehavior): string {
    const deviceCounts = behavior.usagePatterns.reduce((acc, pattern) => {
      acc[pattern.deviceType] = (acc[pattern.deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(deviceCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'desktop';
  }
} 