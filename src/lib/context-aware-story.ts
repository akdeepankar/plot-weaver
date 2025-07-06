import { UserPreferences } from './user-preferences';

export class ContextAwareStory {
  static getContextualPrompt(basePrompt: string, preferences: UserPreferences): string {
    let contextualPrompt = basePrompt;
    
    // Time-based adaptations
    const timeContext = this.getTimeContext(preferences.timeOfDay);
    contextualPrompt += ` ${timeContext}`;
    
    // Energy-based adaptations
    const energyContext = this.getEnergyContext(preferences.energyLevel);
    contextualPrompt += ` ${energyContext}`;
    
    // Stress-based adaptations
    const stressContext = this.getStressContext(preferences.stressLevel);
    contextualPrompt += ` ${stressContext}`;
    
    // Environment-based adaptations
    const environmentContext = this.getEnvironmentContext(preferences.environment);
    contextualPrompt += ` ${environmentContext}`;
    
    // Session length adaptations
    const sessionContext = this.getSessionContext(preferences.sessionLength);
    contextualPrompt += ` ${sessionContext}`;
    
    return contextualPrompt;
  }
  
  private static getTimeContext(timeOfDay: string): string {
    const contexts = {
      morning: "Write with an energizing, optimistic tone perfect for starting the day.",
      afternoon: "Write with a balanced, engaging tone suitable for midday focus.",
      evening: "Write with a reflective, calming tone perfect for winding down.",
      night: "Write with a contemplative, peaceful tone suitable for late hours."
    };
    return contexts[timeOfDay as keyof typeof contexts] || contexts.afternoon;
  }
  
  private static getEnergyContext(energyLevel: string): string {
    const contexts = {
      low: "Use shorter sentences and simpler language. Focus on gentle, uplifting themes.",
      medium: "Use balanced pacing and moderate complexity.",
      high: "Use dynamic language and fast-paced storytelling with exciting elements."
    };
    return contexts[energyLevel as keyof typeof contexts] || contexts.medium;
  }
  
  private static getStressContext(stressLevel: string): string {
    const contexts = {
      low: "Include light, enjoyable elements and positive outcomes.",
      medium: "Balance tension with resolution, include moments of relief.",
      high: "Focus on calming themes, gentle pacing, and stress-relieving content."
    };
    return contexts[stressLevel as keyof typeof contexts] || contexts.medium;
  }
  
  private static getEnvironmentContext(environment: string): string {
    const contexts = {
      quiet: "Use detailed descriptions and immersive storytelling.",
      noisy: "Use clear, straightforward language with strong narrative hooks.",
      public: "Keep content family-friendly and suitable for public reading.",
      private: "Allow for more personal, intimate storytelling themes."
    };
    return contexts[environment as keyof typeof contexts] || contexts.quiet;
  }
  
  private static getSessionContext(sessionLength: string): string {
    const contexts = {
      quick: "Create concise, impactful stories that can be completed quickly.",
      moderate: "Balance detail with pacing for medium-length engagement.",
      extended: "Allow for rich, detailed storytelling with complex character development."
    };
    return contexts[sessionLength as keyof typeof contexts] || contexts.moderate;
  }
  
  static getAdaptiveStoryStructure(preferences: UserPreferences): any {
    const complexity = preferences.complexity;
    const readingSpeed = preferences.readingSpeed;
    
    return {
      paragraphLength: this.getParagraphLength(complexity, readingSpeed),
      chapterStructure: this.getChapterStructure(preferences.sessionLength),
      characterDevelopment: this.getCharacterDevelopment(preferences.interactionStyle),
      plotComplexity: this.getPlotComplexity(complexity)
    };
  }
  
  private static getParagraphLength(complexity: string, readingSpeed: string): number {
    const baseLengths = { simple: 2, moderate: 3, complex: 4 };
    const speedMultipliers = { slow: 0.7, normal: 1, fast: 1.3 };
    
    const baseLength = baseLengths[complexity as keyof typeof baseLengths] || 3;
    const multiplier = speedMultipliers[readingSpeed as keyof typeof speedMultipliers] || 1;
    
    return Math.round(baseLength * multiplier);
  }
  
  private static getChapterStructure(sessionLength: string): string {
    const structures = {
      quick: "single-chapter",
      moderate: "three-act",
      extended: "multi-chapter"
    };
    return structures[sessionLength as keyof typeof structures] || "three-act";
  }
  
  private static getCharacterDevelopment(interactionStyle: string): string {
    const styles = {
      minimal: "simple",
      guided: "moderate",
      immersive: "complex"
    };
    return styles[interactionStyle as keyof typeof styles] || "moderate";
  }
  
  private static getPlotComplexity(complexity: string): string {
    const complexities = {
      simple: "linear",
      moderate: "branching",
      complex: "multi-threaded"
    };
    return complexities[complexity as keyof typeof complexities] || "branching";
  }
} 