export interface UserBehavior {
  storyInteractions: StoryInteraction[];
  readingPatterns: ReadingPattern[];
  preferences: PreferenceHistory[];
  sessionData: SessionData[];
}

export interface StoryInteraction {
  storyId: string;
  storyType: string;
  timeSpent: number;
  paragraphsRead: number;
  userRating?: number;
  userFeedback?: string;
  completed: boolean;
  timestamp: Date;
}

export interface ReadingPattern {
  averageSessionLength: number;
  preferredStoryLength: 'short' | 'medium' | 'long';
  preferredGenres: string[];
  readingSpeed: 'slow' | 'normal' | 'fast';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface PreferenceHistory {
  category: string;
  value: string | number | boolean | string[];
  timestamp: Date;
  source: 'quiz' | 'manual' | 'inferred';
}

export interface SessionData {
  startTime: Date;
  endTime?: Date;
  storiesStarted: number;
  storiesCompleted: number;
  totalTimeSpent: number;
  deviceType: string;
  location?: string;
}

export class LearningSystem {
  private static readonly STORAGE_KEY = 'user-behavior-data';
  
  static trackStoryInteraction(interaction: Omit<StoryInteraction, 'timestamp'>): void {
    if (typeof window === 'undefined') return;
    
    const behavior = this.getBehaviorData();
    behavior.storyInteractions.push({
      ...interaction,
      timestamp: new Date()
    });
    
    this.saveBehaviorData(behavior);
  }
  
  static trackReadingPattern(pattern: ReadingPattern): void {
    if (typeof window === 'undefined') return;
    
    const behavior = this.getBehaviorData();
    behavior.readingPatterns.push(pattern);
    
    this.saveBehaviorData(behavior);
  }
  
  static trackPreferenceChange(category: string, value: string | number | boolean | string[], source: 'quiz' | 'manual' | 'inferred'): void {
    if (typeof window === 'undefined') return;
    
    const behavior = this.getBehaviorData();
    behavior.preferences.push({
      category,
      value,
      timestamp: new Date(),
      source
    });
    
    this.saveBehaviorData(behavior);
  }
  
  static startSession(): string {
    if (typeof window === 'undefined') return '';
    
    const sessionId = `session-${Date.now()}`;
    const behavior = this.getBehaviorData();
    
    behavior.sessionData.push({
      startTime: new Date(),
      storiesStarted: 0,
      storiesCompleted: 0,
      totalTimeSpent: 0,
      deviceType: this.getDeviceType()
    });
    
    this.saveBehaviorData(behavior);
    return sessionId;
  }
  
  static endSession(sessionId: string, data: Partial<SessionData>): void {
    if (typeof window === 'undefined') return;
    
    const behavior = this.getBehaviorData();
    const session = behavior.sessionData.find(s => s.startTime.getTime().toString() === sessionId.split('-')[1]);
    
    if (session) {
      Object.assign(session, data, { endTime: new Date() });
      this.saveBehaviorData(behavior);
    }
  }
  
  static getRecommendedGenres(): string[] {
    const behavior = this.getBehaviorData();
    
    // Analyze completed stories to find preferred genres
    const genreCounts: Record<string, number> = {};
    
    behavior.storyInteractions
      .filter(interaction => interaction.completed)
      .forEach(interaction => {
        const genre = this.extractGenreFromStoryType(interaction.storyType);
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    
    // Return top 3 genres
    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);
  }
  
  static getRecommendedStoryLength(): 'short' | 'medium' | 'long' {
    const behavior = this.getBehaviorData();
    
    // Analyze reading patterns
    const completedStories = behavior.storyInteractions.filter(i => i.completed);
    const avgParagraphs = completedStories.reduce((sum, story) => sum + story.paragraphsRead, 0) / completedStories.length;
    
    if (avgParagraphs < 5) return 'short';
    if (avgParagraphs > 15) return 'long';
    return 'medium';
  }
  
  static getRecommendedReadingSpeed(): 'slow' | 'normal' | 'fast' {
    const behavior = this.getBehaviorData();
    
    // Calculate average time per paragraph
    const completedStories = behavior.storyInteractions.filter(i => i.completed);
    const totalTime = completedStories.reduce((sum, story) => sum + story.timeSpent, 0);
    const totalParagraphs = completedStories.reduce((sum, story) => sum + story.paragraphsRead, 0);
    
    const avgTimePerParagraph = totalTime / totalParagraphs;
    
    if (avgTimePerParagraph < 30) return 'fast';
    if (avgTimePerParagraph > 90) return 'slow';
    return 'normal';
  }
  
  static getOptimalSessionLength(): number {
    const behavior = this.getBehaviorData();
    
    // Calculate average session length
    const completedSessions = behavior.sessionData.filter(s => s.endTime);
    const avgSessionLength = completedSessions.reduce((sum, session) => {
      return sum + (session.endTime!.getTime() - session.startTime.getTime());
    }, 0) / completedSessions.length;
    
    // Convert to minutes and round to nearest 5
    const avgMinutes = Math.round(avgSessionLength / (1000 * 60) / 5) * 5;
    return Math.max(10, Math.min(60, avgMinutes)); // Between 10-60 minutes
  }
  
  static shouldShowEducationalContent(): boolean {
    const behavior = this.getBehaviorData();
    
    // Check if user has shown interest in educational content
    const educationalKeywords = ['learn', 'teach', 'educational', 'history', 'science', 'culture'];
    const hasEducationalInterest = behavior.storyInteractions.some(interaction =>
      educationalKeywords.some(keyword => 
        interaction.userFeedback?.toLowerCase().includes(keyword) ||
        interaction.storyType.toLowerCase().includes(keyword)
      )
    );
    
    return hasEducationalInterest;
  }
  
  static getPersonalizedGreeting(): string {
    const now = new Date();
    const hour = now.getHours();
    
    let timeGreeting = '';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';
    
    // Get user's name if available
    const name = this.getUserName();
    if (name) {
      return `${timeGreeting}, ${name}! Ready for your next adventure?`;
    }
    
    return `${timeGreeting}! Ready for your next adventure?`;
  }
  
  private static getBehaviorData(): UserBehavior {
    if (typeof window === 'undefined') {
      return {
        storyInteractions: [],
        readingPatterns: [],
        preferences: [],
        sessionData: []
      };
    }
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return {
        storyInteractions: [],
        readingPatterns: [],
        preferences: [],
        sessionData: []
      };
    }
    
    try {
      const parsed = JSON.parse(stored);
      return {
        storyInteractions: parsed.storyInteractions?.map((i: Record<string, unknown>) => ({ ...i, timestamp: new Date(i.timestamp as string) })) || [],
        readingPatterns: parsed.readingPatterns || [],
        preferences: parsed.preferences?.map((p: Record<string, unknown>) => ({ ...p, timestamp: new Date(p.timestamp as string) })) || [],
        sessionData: parsed.sessionData?.map((s: Record<string, unknown>) => ({ ...s, startTime: new Date(s.startTime as string), endTime: s.endTime ? new Date(s.endTime as string) : undefined })) || []
      };
    } catch {
      return {
        storyInteractions: [],
        readingPatterns: [],
        preferences: [],
        sessionData: []
      };
    }
  }
  
  private static saveBehaviorData(behavior: UserBehavior): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(behavior));
  }
  
  private static extractGenreFromStoryType(storyType: string): string {
    const genreMap: Record<string, string> = {
      'fairy tale': 'fantasy',
      'sci-fi': 'science fiction',
      'mystery': 'mystery',
      'adventure': 'adventure',
      'romance': 'romance',
      'horror': 'horror',
      'comedy': 'comedy',
      'drama': 'drama'
    };
    
    const lowerType = storyType.toLowerCase();
    for (const [key, genre] of Object.entries(genreMap)) {
      if (lowerType.includes(key)) return genre;
    }
    
    return 'general';
  }
  
  private static getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return 'mobile';
    if (/Tablet|iPad/.test(userAgent)) return 'tablet';
    return 'desktop';
  }
  
  private static getUserName(): string | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('user-preferences');
    if (!stored) return null;
    
    try {
      const prefs = JSON.parse(stored);
      return prefs.name || null;
    } catch {
      return null;
    }
  }
} 