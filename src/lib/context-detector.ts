export interface ContextData {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'unknown';
  location: {
    city?: string;
    country?: string;
    timezone?: string;
    coordinates?: { lat: number; lng: number };
  };
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  emojis: {
    time: string;
    weather: string;
    location: string;
    season: string;
  };
}

export class ContextDetector {
  static async getContextData(): Promise<ContextData> {
    try {
      const timeOfDay = this.getTimeOfDay();
      const weather = await this.getWeather();
      const location = await this.getLocation();
      const season = this.getSeason();
      
      return {
        timeOfDay,
        weather,
        location,
        season,
        emojis: {
          time: this.getTimeEmoji(timeOfDay),
          weather: this.getWeatherEmoji(weather),
          location: this.getLocationEmoji(location),
          season: this.getSeasonEmoji(season)
        }
      };
    } catch (error) {
      console.log('Context detection failed:', error);
      // Return basic context with current time
      const timeOfDay = this.getTimeOfDay();
      const season = this.getSeason();
      
      return {
        timeOfDay,
        weather: 'unknown',
        location: {},
        season,
        emojis: {
          time: this.getTimeEmoji(timeOfDay),
          weather: this.getWeatherEmoji('unknown'),
          location: this.getLocationEmoji({}),
          season: this.getSeasonEmoji(season)
        }
      };
    }
  }
  
  private static getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }
  
  private static getTimeEmoji(timeOfDay: string): string {
    const emojis = {
      morning: '🌅',
      afternoon: '☀️',
      evening: '🌆',
      night: '🌙'
    };
    return emojis[timeOfDay as keyof typeof emojis] || '🕐';
  }
  
  private static async getWeather(): Promise<'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'unknown'> {
    try {
      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        console.log('OpenWeatherMap API key not found, using fallback');
        return 'unknown';
      }
      
      // Get user's location first
      const position = await this.getCurrentPosition();
      if (!position) return 'unknown';
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) return 'unknown';
      
      const data = await response.json();
      const weatherMain = data.weather[0].main.toLowerCase();
      
      if (weatherMain.includes('clear')) return 'sunny';
      if (weatherMain.includes('cloud')) return 'cloudy';
      if (weatherMain.includes('rain')) return 'rainy';
      if (weatherMain.includes('snow')) return 'snowy';
      if (weatherMain.includes('thunder')) return 'stormy';
      
      return 'unknown';
    } catch (error) {
      console.log('Weather detection failed:', error);
      return 'unknown';
    }
  }
  
  private static getWeatherEmoji(weather: string): string {
    const emojis = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      snowy: '❄️',
      stormy: '⛈️',
      unknown: '🌤️'
    };
    return emojis[weather as keyof typeof emojis] || '🌤️';
  }
  
  private static async getLocation(): Promise<{ city?: string; country?: string; timezone?: string; coordinates?: { lat: number; lng: number } }> {
    try {
      const position = await this.getCurrentPosition();
      if (!position) return {};
      
      const { latitude, longitude } = position.coords;
      
      // Check if API key is available for reverse geocoding
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        console.log('OpenWeatherMap API key not found, using basic location');
        return {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          coordinates: { lat: latitude, lng: longitude }
        };
      }
      
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          return {
            city: data[0].name,
            country: data[0].country,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            coordinates: { lat: latitude, lng: longitude }
          };
        }
      }
      
      return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        coordinates: { lat: latitude, lng: longitude }
      };
    } catch (error) {
      console.log('Location detection failed:', error);
      return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
  }
  
  private static getLocationEmoji(location: { city?: string; country?: string; timezone?: string; coordinates?: { lat: number; lng: number } }): string {
    if (location.city) {
      // Return city-specific emoji or generic location emoji
      return '📍';
    }
    return '🌍';
  }
  
  private static getSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
    const month = new Date().getMonth();
    
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }
  
  private static getSeasonEmoji(season: string): string {
    const emojis = {
      spring: '🌸',
      summer: '☀️',
      autumn: '🍂',
      winter: '❄️'
    };
    return emojis[season as keyof typeof emojis] || '🌱';
  }
  
  private static getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      });
    });
  }
  
  static getContextualPrompt(context: ContextData): string {
    let prompt = '';
    
    // Time-based context
    const timeContexts = {
      morning: 'Create an energizing, optimistic story perfect for starting the day.',
      afternoon: 'Write a balanced, engaging story suitable for midday focus.',
      evening: 'Craft a reflective, calming story perfect for winding down.',
      night: 'Write a contemplative, peaceful story suitable for late hours.'
    };
    prompt += ` ${timeContexts[context.timeOfDay]}`;
    
    // Weather-based context
    const weatherContexts = {
      sunny: 'Include bright, uplifting elements and outdoor scenes.',
      cloudy: 'Use a balanced tone with moments of both brightness and reflection.',
      rainy: 'Incorporate cozy, indoor elements and contemplative moments.',
      snowy: 'Include magical, peaceful elements and winter wonder.',
      stormy: 'Use dramatic elements but balance with moments of calm.',
      unknown: 'Maintain a neutral, adaptable tone.'
    };
    prompt += ` ${weatherContexts[context.weather]}`;
    
    // Season-based context
    const seasonContexts = {
      spring: 'Include themes of renewal, growth, and new beginnings.',
      summer: 'Incorporate warmth, adventure, and vibrant energy.',
      autumn: 'Use themes of change, reflection, and cozy moments.',
      winter: 'Include elements of magic, warmth, and peaceful contemplation.'
    };
    prompt += ` ${seasonContexts[context.season]}`;
    
    // Location-based context
    if (context.location.city) {
      prompt += ` Consider the cultural and environmental context of ${context.location.city}.`;
    }
    
    return prompt;
  }
} 