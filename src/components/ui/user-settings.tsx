"use client";
import { useState, useEffect } from 'react';
import { UserPreferences, UserPreferencesManager, DEFAULT_PREFERENCES } from '@/lib/user-preferences';

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesUpdate: () => void;
}

export function UserSettings({ isOpen, onClose, onPreferencesUpdate }: UserSettingsProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [activeSection, setActiveSection] = useState('profile');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPreferences(UserPreferencesManager.getPreferences());
      setCurrentStep(0);
      setActiveSection('profile');
    }
  }, [isOpen]);

  const handleSave = () => {
    UserPreferencesManager.updatePreferences(preferences);
    onPreferencesUpdate();
    onClose();
  };

  const sections = [
    { id: 'profile', title: 'Your Profile', icon: '👤' },
    { id: 'story-style', title: 'Story Style', icon: '📚' },
    { id: 'content', title: 'Content Preferences', icon: '🎭' },
    { id: 'reading', title: 'Reading Experience', icon: '📖' },
    { id: 'advanced', title: 'Advanced Settings', icon: '⚙️' },
  ];

  const storyStyleQuestions = [
    {
      id: 'writingStyle',
      question: "How would you like your stories to be written?",
      options: [
        { value: 'simple', label: 'Simple & Clear', description: 'Easy to read, straightforward language' },
        { value: 'descriptive', label: 'Rich & Descriptive', description: 'Vivid imagery and detailed scenes' },
        { value: 'poetic', label: 'Poetic & Lyrical', description: 'Beautiful language with metaphors' },
        { value: 'conversational', label: 'Conversational', description: 'Natural, chatty tone like talking to a friend' },
      ]
    },
    {
      id: 'emotionalTone',
      question: "What emotional tone do you prefer in stories?",
      options: [
        { value: 'light', label: 'Light & Fun', description: 'Humorous, uplifting, feel-good stories' },
        { value: 'neutral', label: 'Balanced', description: 'Mix of emotions, realistic tone' },
        { value: 'dark', label: 'Dark & Serious', description: 'Intense, dramatic, thought-provoking' },
        { value: 'uplifting', label: 'Inspirational', description: 'Motivational, hopeful, encouraging' },
      ]
    },
    {
      id: 'storyLength',
      question: "How long do you prefer your stories to be?",
      options: [
        { value: 'short', label: 'Short & Sweet', description: 'Quick reads, focused plots' },
        { value: 'medium', label: 'Medium Length', description: 'Well-developed, balanced stories' },
        { value: 'long', label: 'Epic Tales', description: 'Detailed, multi-chapter adventures' },
      ]
    }
  ];

  const contentQuestions = [
    {
      id: 'preferredGenres',
      question: "Which story elements interest you most?",
      options: [
        { value: 'fantasy', label: 'Fantasy & Magic', description: 'Wizards, dragons, enchanted worlds' },
        { value: 'sci-fi', label: 'Science Fiction', description: 'Space, technology, futuristic worlds' },
        { value: 'mystery', label: 'Mystery & Suspense', description: 'Puzzles, detective work, intrigue' },
        { value: 'romance', label: 'Romance & Relationships', description: 'Love stories, emotional connections' },
        { value: 'adventure', label: 'Adventure & Action', description: 'Thrilling quests, exciting journeys' },
        { value: 'horror', label: 'Horror & Thriller', description: 'Spooky, suspenseful, scary elements' },
        { value: 'comedy', label: 'Comedy & Humor', description: 'Funny, lighthearted, entertaining' },
        { value: 'drama', label: 'Drama & Realism', description: 'Realistic, emotional, character-driven' },
      ]
    },
    {
      id: 'characterTypes',
      question: "What types of characters do you enjoy?",
      type: 'text',
      placeholder: 'e.g., brave heroes, wise mentors, clever detectives, strong female leads...'
    },
    {
      id: 'settings',
      question: "What settings or environments do you find most interesting?",
      type: 'text',
      placeholder: 'e.g., medieval castles, space stations, enchanted forests, modern cities...'
    }
  ];

  const readingQuestions = [
    {
      id: 'readingLevel',
      question: "What's your reading comfort level?",
      options: [
        { value: 'beginner', label: 'Beginner', description: 'Simple vocabulary, easy to follow' },
        { value: 'intermediate', label: 'Intermediate', description: 'Standard vocabulary, engaging but accessible' },
        { value: 'advanced', label: 'Advanced', description: 'Sophisticated language, complex themes' },
      ]
    },
    {
      id: 'preferEmojis',
      question: "Do you like emojis in your stories?",
      type: 'boolean',
      options: [
        { value: true, label: 'Yes, add emojis! 😊', description: 'Makes stories more expressive and fun' },
        { value: false, label: 'No, keep it clean', description: 'Traditional text-only storytelling' },
      ]
    },
    {
      id: 'maxParagraphsPerSession',
      question: "How many story segments do you prefer per session?",
      type: 'number',
      min: 1,
      max: 10,
      description: 'This helps pace the story generation'
    }
  ];

  const renderQuestion = (question: any) => {
    if (question.type === 'text') {
      return (
        <div key={question.id} className="space-y-3">
          <label className="block text-lg font-semibold text-gray-800">
            {question.question}
          </label>
          <input
            type="text"
            value={preferences[question.id as keyof UserPreferences] as string || ''}
            onChange={(e) => setPreferences(prev => ({ 
              ...prev, 
              [question.id]: e.target.value 
            }))}
            placeholder={question.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      );
    }

    if (question.type === 'boolean') {
      return (
        <div key={question.id} className="space-y-3">
          <label className="block text-lg font-semibold text-gray-800">
            {question.question}
          </label>
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option: any) => (
              <label key={option.value} className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={preferences[question.id as keyof UserPreferences] === option.value}
                  onChange={(e) => setPreferences(prev => ({ 
                    ...prev, 
                    [question.id]: e.target.value === 'true' ? true : false 
                  }))}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === 'number') {
      return (
        <div key={question.id} className="space-y-3">
          <label className="block text-lg font-semibold text-gray-800">
            {question.question}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min={question.min}
              max={question.max}
              value={preferences[question.id as keyof UserPreferences] as number}
              onChange={(e) => setPreferences(prev => ({ 
                ...prev, 
                [question.id]: parseInt(e.target.value) 
              }))}
              className="w-24 p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-600">{question.description}</span>
          </div>
        </div>
      );
    }

    // Default radio options
    return (
      <div key={question.id} className="space-y-3">
        <label className="block text-lg font-semibold text-gray-800">
          {question.question}
        </label>
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option: any) => (
            <label key={option.value} className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={preferences[question.id as keyof UserPreferences] === option.value}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  [question.id]: e.target.value 
                }))}
                className="mt-1 mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h3>
              <p className="text-gray-600">This helps us create stories that match your preferences</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">What's your name?</label>
                <input
                  type="text"
                  value={preferences.name || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name (optional)"
                />
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">What's your cultural background?</label>
                <input
                  type="text"
                  value={preferences.culturalBackground || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, culturalBackground: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., American, Japanese, Brazilian, Indian..."
                />
                <p className="text-sm text-gray-600 mt-2">This helps us include culturally relevant elements in your stories</p>
              </div>
            </div>
          </div>
        );

      case 'story-style':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Story Style Preferences</h3>
              <p className="text-gray-600">How would you like your AI-generated stories to be written?</p>
            </div>
            
            <div className="space-y-8">
              {storyStyleQuestions.map(renderQuestion)}
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Content Preferences</h3>
              <p className="text-gray-600">What elements would you like to see in your stories?</p>
            </div>
            
            <div className="space-y-8">
              {contentQuestions.map(renderQuestion)}
            </div>
          </div>
        );

      case 'reading':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Reading Experience</h3>
              <p className="text-gray-600">How do you prefer to read and interact with stories?</p>
            </div>
            
            <div className="space-y-8">
              {readingQuestions.map(renderQuestion)}
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Advanced Settings</h3>
              <p className="text-gray-600">Fine-tune your AI story generation experience</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">Topics to avoid in stories</label>
                <input
                  type="text"
                  value={preferences.avoidTopics.join(', ')}
                  onChange={(e) => setPreferences(prev => ({ 
                    ...prev, 
                    avoidTopics: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., violence, politics, religion, specific triggers..."
                />
                <p className="text-sm text-gray-600 mt-2">Separate multiple topics with commas</p>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">Educational content</label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={preferences.wantEducationalContent}
                      onChange={(e) => setPreferences(prev => ({ ...prev, wantEducationalContent: e.target.checked }))}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Include educational elements</div>
                      <div className="text-sm text-gray-600">Learn something new while enjoying stories</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Personalization Settings</h2>
            <p className="text-gray-600">Customize your AI story experience</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-50 p-4 border-r">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-sm'
                      : 'hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{section.icon}</span>
                    <div>
                      <div className="font-semibold">{section.title}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderSection()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={() => {
              UserPreferencesManager.resetPreferences();
              onPreferencesUpdate();
              onClose();
            }}
            className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Reset All Settings
          </button>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 