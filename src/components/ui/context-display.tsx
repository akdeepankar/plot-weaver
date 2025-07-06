"use client";
import { useState, useEffect } from 'react';
import { ContextData, ContextDetector } from '@/lib/context-detector';

export function ContextDisplay() {
  const [context, setContext] = useState<ContextData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const contextData = await ContextDetector.getContextData();
        setContext(contextData);
      } catch (error) {
        console.log('Failed to load context:', error);
        // Set fallback context with current time
        const now = new Date();
        const hour = now.getHours();
        let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'afternoon';
        
        if (hour >= 5 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
        else timeOfDay = 'night';
        
        const month = now.getMonth();
        let season: 'spring' | 'summer' | 'autumn' | 'winter' = 'summer';
        if (month >= 2 && month <= 4) season = 'spring';
        else if (month >= 5 && month <= 7) season = 'summer';
        else if (month >= 8 && month <= 10) season = 'autumn';
        else season = 'winter';
        
        const timeEmojis = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' };
        const seasonEmojis = { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' };
        
        setContext({
          timeOfDay,
          weather: 'unknown',
          location: {},
          season,
          emojis: {
            time: timeEmojis[timeOfDay],
            weather: '🌤️',
            location: '🌍',
            season: seasonEmojis[season]
          }
        });
      } finally {
        setLoading(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Context detection timed out, using fallback');
        setLoading(false);
        // Set basic fallback context
        const now = new Date();
        const hour = now.getHours();
        const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : 
                         hour >= 12 && hour < 17 ? 'afternoon' : 
                         hour >= 17 && hour < 21 ? 'evening' : 'night';
        
        setContext({
          timeOfDay,
          weather: 'unknown',
          location: {},
          season: 'summer',
          emojis: {
            time: '🕐',
            weather: '🌤️',
            location: '🌍',
            season: '🌱'
          }
        });
      }
    }, 5000); // 5 second timeout

    loadContext();
    
    // Update context every 30 minutes
    const interval = setInterval(loadContext, 30 * 60 * 1000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span>Detecting context...</span>
      </div>
    );
  }

  if (!context) return null;

  return (
    <div className="relative">
      {/* Location Trigger */}
      <div 
        className="bg-gray-100 px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{context.emojis.location}</span>
          <span className="text-gray-700 font-medium text-xs">
            {context.location.city || 'Location'}
          </span>
        </div>
      </div>
      
      {/* Dropdown Popup */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 min-w-[200px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{context.emojis.time}</span>
              <span className="text-gray-700 capitalize font-medium text-sm">{context.timeOfDay}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg">{context.emojis.weather}</span>
              <span className="text-gray-700 capitalize font-medium text-sm">{context.weather}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg">{context.emojis.location}</span>
              <span className="text-gray-700 font-medium text-sm">
                {context.location.city || 'Location'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 