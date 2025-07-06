"use client";
import { useState, useEffect } from "react";
import { TamboClientProvider } from "@tambo-ai/react";
import { MessageThreadCollapsible } from "@/components/ui/message-thread-collapsible";
import { useLocalization } from "@/lib/localization";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ProUpgradeModal } from "@/components/ui/pro-upgrade-modal";
import { UserSettings } from "@/components/ui/user-settings";
import { ContextDisplay } from "@/components/ui/context-display";

import { CustomerInit } from "@/components/ui/customer-init";
import { useCustomer } from "autumn-js/react";
import { getCustomerId } from "@/lib/autumn-client";
import { UserPreferencesManager } from "@/lib/user-preferences";
import { LearningSystem } from "@/lib/learning-system";

// Add type definitions at the top
interface Storyline {
  title: string;
  prompt: string;
}

interface SavedStory {
  id: string;
  title: string;
  content: string[];
  date: string;
  archetype: string;
}

interface WordPopup {
  word: string;
  definition: string;
  isOpen: boolean;
  position: { x: number; y: number };
}

interface Customer {
  subscriptions?: Array<{ productId: string }>;
  products?: Array<{ id: string }>;
  attachments?: Array<{ productId: string }>;
}

const STORYLINES_BY_ARCHETYPE = {
  explorer: [
    { title: "Lost City of Atlantis", prompt: "An archaeologist discovers an ancient map leading to the lost city of Atlantis, but the journey reveals secrets that could change history forever." },
    { title: "Space Colony Exodus", prompt: "A group of pioneers leaves Earth to establish humanity's first interstellar colony, facing unknown dangers in deep space." },
    { title: "Time Traveler's Dilemma", prompt: "A scientist accidentally travels back to medieval times and must decide whether to change history or preserve the timeline." },
    { title: "Dragon Rider Academy", prompt: "A young orphan discovers they have the rare ability to bond with dragons and enters a secret academy to become a dragon rider." },
  ],
  philosopher: [
    { title: "The Mirror of Truth", prompt: "A philosopher discovers a mirror that shows not reflections, but the true nature of reality, forcing them to question everything they know." },
    { title: "Dreams of the Collective", prompt: "In a world where everyone shares the same dreams, one person begins to have different dreams, leading to a philosophical awakening." },
    { title: "The Last Library", prompt: "In a post-apocalyptic world, a librarian guards the last repository of human knowledge, but must decide what to preserve and what to let go." },
    { title: "Consciousness Transfer", prompt: "A dying scientist transfers their consciousness into a computer, but discovers that digital existence raises profound questions about what it means to be human." },
  ],
  survivor: [
    { title: "Nuclear Winter", prompt: "After a nuclear war, a mother and her child must navigate a frozen wasteland to find the last safe haven, facing both human and environmental threats." },
    { title: "Prison Break", prompt: "A wrongfully convicted prisoner plans an elaborate escape from a maximum-security facility, but the plan goes awry when they discover a conspiracy." },
    { title: "Zombie Apocalypse", prompt: "A former soldier must protect a group of survivors in a world overrun by the undead, while dealing with their own traumatic past." },
    { title: "Economic Collapse", prompt: "When the global economy collapses, a family must adapt to a world where money is worthless and survival depends on skills and community." },
  ],
  caregiver: [
    { title: "The Healing Garden", prompt: "A nurse discovers a magical garden where plants can heal any ailment, but must protect it from those who would exploit its power." },
    { title: "Foster Family Bonds", prompt: "A social worker takes in a troubled child with mysterious abilities, and together they learn what it means to be a real family." },
    { title: "Animal Sanctuary", prompt: "A veterinarian inherits a failing animal sanctuary and must find a way to save both the animals and the community that depends on it." },
    { title: "Memory Care", prompt: "A daughter caring for her mother with Alzheimer's discovers a way to preserve precious memories, but at what cost?" },
  ],
};

const DEFAULT_STORYLINES = [
  { title: "Mystery Manor", prompt: "A detective investigates strange occurrences in an old mansion, uncovering secrets that have been hidden for generations." },
  { title: "Cyberpunk Dreams", prompt: "In a neon-lit future, a hacker discovers a conspiracy that could change the digital world forever." },
  { title: "Fantasy Quest", prompt: "A young hero embarks on a quest to save their village from an ancient evil, discovering their true destiny along the way." },
  { title: "Romance in Paris", prompt: "Two strangers meet in Paris and fall in love, but their different backgrounds threaten to tear them apart." },
];

const QUIZ_QUESTIONS = [
  {
    question: "How do you prefer stories to end?",
    options: [
      { text: "🟡 With a sense of hope or adventure", archetype: "explorer" },
      { text: "⚫ Ambiguous and open to interpretation", archetype: "philosopher" },
      { text: "🔴 Realistic or even tragic, as long as it's honest", archetype: "survivor" },
      { text: "🟢 Uplifting and emotionally satisfying", archetype: "caregiver" },
    ],
  },
  {
    question: "Which word best describes how you process the world?",
    options: [
      { text: "🌈 Wonder", archetype: "explorer" },
      { text: "🔍 Reflection", archetype: "philosopher" },
      { text: "🔥 Survival", archetype: "survivor" },
      { text: "💞 Connection", archetype: "caregiver" },
    ],
  },
  {
    question: "Choose a setting you'd enjoy reading about:",
    options: [
      { text: "🚀 A crew exploring alien ruins", archetype: "explorer" },
      { text: "⛩️ A lone monk in a misty temple", archetype: "philosopher" },
      { text: "🏚️ A refugee escaping a war zone", archetype: "survivor" },
      { text: "🏡 A nurse caring for a remote village", archetype: "caregiver" },
    ],
  },
  {
    question: "How do you feel about emotional intensity in stories?",
    options: [
      { text: "🟢 Some is good, but I prefer action or ideas", archetype: "explorer" },
      { text: "⚫ I want deep emotion, but expressed subtly", archetype: "philosopher" },
      { text: "🔴 Give me raw, painful honesty", archetype: "survivor" },
      { text: "💗 I want warmth, connection, and healing", archetype: "caregiver" },
    ],
  },
  {
    question: "What kind of language do you prefer in books?",
    options: [
      { text: "✈️ Simple, energetic, quick to read", archetype: "explorer" },
      { text: "🌌 Rich metaphors and layered prose", archetype: "philosopher" },
      { text: "🪨 Minimalist, punchy, brutally clear", archetype: "survivor" },
      { text: "🍃 Flowing, kind, and emotionally nuanced", archetype: "caregiver" },
    ],
  },
];

export default function Home() {
  const { locale, setLocale, t } = useLocalization();
  const { customer } = useCustomer();
  const [isProUser, setIsProUser] = useState(false);
  
  const getArchetypeTheme = (archetype: string) => {
    switch (archetype) {
      case 'explorer':
        return {
          primary: 'text-blue-600',
          accent: 'bg-blue-50',
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'philosopher':
        return {
          primary: 'text-purple-600',
          accent: 'bg-purple-50',
          border: 'border-purple-200',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'survivor':
        return {
          primary: 'text-red-600',
          accent: 'bg-red-50',
          border: 'border-red-200',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'caregiver':
        return {
          primary: 'text-green-600',
          accent: 'bg-green-50',
          border: 'border-green-200',
          button: 'bg-green-600 hover:bg-green-700'
        };
      default:
        return {
          primary: 'text-gray-600',
          accent: 'bg-gray-50',
          border: 'border-gray-200',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };
  
  // Function to get translated story title
  const getTranslatedStoryTitle = (originalTitle: string) => {
    const titleMap: Record<string, string> = {
      "Lost City of Atlantis": t('storyStarters.lostCityAtlantis'),
      "Space Colony Exodus": t('storyStarters.spaceColonyExodus'),
      "Time Traveler's Dilemma": t('storyStarters.timeTravelerDilemma'),
      "Dragon Rider Academy": t('storyStarters.dragonRiderAcademy'),
      "The Mirror of Truth": t('storyStarters.mirrorOfTruth'),
      "Dreams of the Collective": t('storyStarters.dreamsOfCollective'),
      "The Last Library": t('storyStarters.lastLibrary'),
      "Consciousness Transfer": t('storyStarters.consciousnessTransfer'),
      "Nuclear Winter": t('storyStarters.nuclearWinter'),
      "Prison Break": t('storyStarters.prisonBreak'),
      "Zombie Apocalypse": t('storyStarters.zombieApocalypse'),
      "Economic Collapse": t('storyStarters.economicCollapse'),
      "The Healing Garden": t('storyStarters.healingGarden'),
      "Foster Family Bonds": t('storyStarters.fosterFamilyBonds'),
      "Animal Sanctuary": t('storyStarters.animalSanctuary'),
      "Memory Care": t('storyStarters.memoryCare'),
      "Mystery Manor": t('storyStarters.mysteryManor'),
      "Cyberpunk Dreams": t('storyStarters.cyberpunkDreams'),
      "Fantasy Quest": t('storyStarters.fantasyQuest'),
      "Romance in Paris": t('storyStarters.romanceInParis'),
    };
    
    return titleMap[originalTitle] || originalTitle;
  };
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ explorer: 0, philosopher: 0, survivor: 0, caregiver: 0 });
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showSetupPopup, setShowSetupPopup] = useState(false);
  const [selectedStoryline, setSelectedStoryline] = useState<Storyline | null>(null);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [storyCards, setStoryCards] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [storyOptions, setStoryOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [useEmojis, setUseEmojis] = useState(true);
  const [mood, setMood] = useState<'neutral' | 'happy' | 'sad' | 'excited' | 'relaxed'>('neutral');
  const [totalStoryCards, setTotalStoryCards] = useState(0);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFriendly, setDyslexiaFriendly] = useState(false);
  const [clickableWords, setClickableWords] = useState(false);
  const [showCustomStory, setShowCustomStory] = useState(false);
  const [wordPopup, setWordPopup] = useState<WordPopup | null>(null);
  const [customStoryPrompt, setCustomStoryPrompt] = useState("");
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false);
  const [localUsageCount, setLocalUsageCount] = useState(0);
  const [customerId, setCustomerId] = useState<string>("");
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'starters' | 'saved'>('starters');
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Load usage count from localStorage
  useEffect(() => {
    console.log("=== Loading Credits from localStorage ===");
    const savedUsageCount = localStorage.getItem("storyUsageCount");
    if (savedUsageCount) {
      setLocalUsageCount(parseInt(savedUsageCount));
      console.log(`Loaded from localStorage: ${savedUsageCount} used credits`);
    } else {
      // No saved data, start fresh with 0 used (5 available)
      setLocalUsageCount(0);
      localStorage.setItem("storyUsageCount", "0");
      console.log("Starting fresh with 0 used credits (5 available)");
    }
    console.log("=== End Loading Credits ===");
  }, []);

  // Hide save notification after 3 seconds
  useEffect(() => {
    if (showSaveNotification) {
      const timer = setTimeout(() => {
        setShowSaveNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveNotification]);

  // Close word popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wordPopup && wordPopup.isOpen) {
        setWordPopup(null);
      }
    };

    if (wordPopup && wordPopup.isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [wordPopup]);

  // Load customer ID
  useEffect(() => {
    const id = getCustomerId();
    setCustomerId(id);
    console.log("Customer ID loaded:", id);
  }, []);

  // Check Pro status by checking if user has Pro product attached
  useEffect(() => {
    const checkProProduct = () => {
      console.log("Checking Pro status...");
      console.log("Customer data:", customer);
      console.log("Customer subscriptions:", customer && (customer as Customer).subscriptions);
      
      // Check multiple possible ways Pro status might be stored
      const hasProSubscription = customer && (
        (customer as Customer).subscriptions?.some((sub: { productId: string }) => sub.productId === "pro") ||
        (customer as Customer).products?.some((prod: { id: string }) => prod.id === "pro") ||
        (customer as Customer).attachments?.some((att: { productId: string }) => att.productId === "pro")
      );
      
      console.log("Has Pro subscription:", hasProSubscription);
      
      // Only set Pro user if they have subscription AND haven't reached credit limit
      if (hasProSubscription && localUsageCount < 20) {
        console.log("User has Pro product attached and credits available");
        setIsProUser(true);
      } else {
        console.log("User does not have Pro product or has reached credit limit");
        setIsProUser(false);
      }
    };

    checkProProduct();
  }, [customer, localUsageCount]);

  // Load user profile and total story cards
  useEffect(() => {
    const savedProfile = localStorage.getItem("personalityProfile");
    if (!savedProfile) {
      setShowQuiz(true);
    } else {
      setUserProfile(savedProfile);
    }
    
    // Load total story cards from localStorage
    const savedTotalCards = localStorage.getItem("totalStoryCards");
    if (savedTotalCards) {
      setTotalStoryCards(parseInt(savedTotalCards));
    }
    
    // Load saved stories from localStorage
    const savedStoriesData = localStorage.getItem("savedStories");
    if (savedStoriesData) {
      setSavedStories(JSON.parse(savedStoriesData));
    }
    
    // Load accessibility settings from localStorage
    const savedTextSize = localStorage.getItem("accessibility-textSize");
    if (savedTextSize) {
      setTextSize(savedTextSize as 'small' | 'medium' | 'large');
    }
    
    const savedHighContrast = localStorage.getItem("accessibility-highContrast");
    if (savedHighContrast) {
      setHighContrast(savedHighContrast === 'true');
    }
    
    const savedDyslexiaFriendly = localStorage.getItem("accessibility-dyslexiaFriendly");
    if (savedDyslexiaFriendly) {
      setDyslexiaFriendly(savedDyslexiaFriendly === 'true');
    }
    
    const savedClickableWords = localStorage.getItem("accessibility-clickableWords");
    if (savedClickableWords) {
      setClickableWords(savedClickableWords === 'true');
    }
    
    // Initialize learning system
    LearningSystem.startSession();
  }, []);

  const theme = userProfile ? getArchetypeTheme(userProfile) : getArchetypeTheme('default');

  const updateTotalStoryCards = (newCards: number) => {
    const newTotal = totalStoryCards + newCards;
    setTotalStoryCards(newTotal);
    localStorage.setItem("totalStoryCards", newTotal.toString());
  };

  // Save story to localStorage
  const saveStory = (title: string, content: string[], archetype: string) => {
    // Check if a story with the same title already exists
    const existingStoryIndex = savedStories.findIndex(story => story.title === title);
    
    if (existingStoryIndex !== -1) {
      // Update existing story
      const updatedStories = [...savedStories];
      updatedStories[existingStoryIndex] = {
        ...updatedStories[existingStoryIndex],
        content,
        date: new Date().toLocaleDateString(),
        archetype
      };
      setSavedStories(updatedStories);
      localStorage.setItem("savedStories", JSON.stringify(updatedStories));
      setShowSaveNotification(true);
    } else {
      // Create new story
      const newStory = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toLocaleDateString(),
        archetype
      };
      
      const updatedStories = [newStory, ...savedStories];
      setSavedStories(updatedStories);
      localStorage.setItem("savedStories", JSON.stringify(updatedStories));
      setShowSaveNotification(true);
    }
  };

  // Delete saved story
  const deleteSavedStory = (storyId: string) => {
    const updatedStories = savedStories.filter(story => story.id !== storyId);
    setSavedStories(updatedStories);
    localStorage.setItem("savedStories", JSON.stringify(updatedStories));
  };

  // Load saved story
  const loadSavedStory = (story: SavedStory) => {
    setSelectedStoryline({ title: story.title, prompt: story.title });
    setStoryCards(story.content);
    setCurrentParagraph(0);
  };

  // Get credit limit based on Pro status
  const getCreditLimit = () => {
    return isProUser ? 20 : 5;
  };

  // Save accessibility settings to localStorage
  const saveAccessibilitySettings = (setting: string, value: string | boolean) => {
    localStorage.setItem(`accessibility-${setting}`, value.toString());
  };

  // Handle text size change
  const handleTextSizeChange = () => {
    const newSize = textSize === 'small' ? 'medium' : textSize === 'medium' ? 'large' : 'small';
    setTextSize(newSize);
    saveAccessibilitySettings('textSize', newSize);
  };

  // Handle high contrast toggle
  const handleHighContrastToggle = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    saveAccessibilitySettings('highContrast', newValue);
  };

  // Handle dyslexia-friendly toggle
  const handleDyslexiaFriendlyToggle = () => {
    const newValue = !dyslexiaFriendly;
    setDyslexiaFriendly(newValue);
    saveAccessibilitySettings('dyslexiaFriendly', newValue);
  };

  // Handle clickable words toggle
  const handleClickableWordsToggle = () => {
    const newValue = !clickableWords;
    setClickableWords(newValue);
    saveAccessibilitySettings('clickableWords', newValue);
  };

  // Get word definition from OpenAI
  const getWordDefinition = async (word: string, event: React.MouseEvent) => {
    try {
      // Show loading popup
      setWordPopup({
        word,
        definition: 'Loading...',
        isOpen: true,
        position: { x: event.clientX, y: event.clientY }
      });

      const response = await fetch('/api/word-definition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, locale }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch definition');
      }

      const data = await response.json();
      
      setWordPopup({
        word,
        definition: data.definition,
        isOpen: true,
        position: { x: event.clientX, y: event.clientY }
      });

      // Save to localStorage
      try {
        const key = 'wordMeanings';
        const now = Date.now();
        let arr: Array<{ word: string; meaning: string; language: string; timestamp: number }> = [];
        const existing = localStorage.getItem(key);
        if (existing) {
          arr = JSON.parse(existing);
        }
        // Check if word+language already exists (case-insensitive)
        const idx = arr.findIndex(
          (entry) => entry.word.toLowerCase() === word.toLowerCase() && entry.language === locale
        );
        if (idx !== -1) {
          arr[idx] = { word, meaning: data.definition, language: locale, timestamp: now };
        } else {
          arr.push({ word, meaning: data.definition, language: locale, timestamp: now });
        }
        localStorage.setItem(key, JSON.stringify(arr));
      } catch (err) {
        console.error('Failed to save word meaning to localStorage', err);
      }
    } catch (error) {
      console.error('Error fetching word definition:', error);
      setWordPopup({
        word,
        definition: 'Unable to load definition. Please try again.',
        isOpen: true,
        position: { x: event.clientX, y: event.clientY }
      });
    }
  };

  // Render clickable words
  const renderClickableWords = (text: string) => {
    if (!clickableWords) {
      return text;
    }
    
    const words = text.split(' ');
    return words.map((word, index) => (
      <span
        key={index}
        style={{
          display: 'inline-block',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          padding: '2px 4px',
          borderRadius: '4px',
          margin: '0 1px'
        }}
        className="hover:!bg-blue-200 hover:!text-blue-800 hover:!font-semibold"
        onClick={(event) => {
          getWordDefinition(word, event);
        }}
        title={`Click for more info about "${word}"`}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#bfdbfe';
          e.currentTarget.style.color = '#1e40af';
          e.currentTarget.style.fontWeight = '600';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '';
          e.currentTarget.style.color = '';
          e.currentTarget.style.fontWeight = '';
        }}
      >
        {word}
        {index < words.length - 1 ? ' ' : ''}
      </span>
    ));
  };


  const handleStartCustomStory = () => {
    if (customStoryPrompt.trim()) {
      // Generate a title from the first few words of the prompt
      const words = customStoryPrompt.trim().split(' ');
      const title = words.length > 3 
        ? words.slice(0, 3).join(' ') + '...'
        : words.join(' ');
      
      const customStoryline = {
        title: title,
        prompt: customStoryPrompt.trim()
      };
      handleStreamingStory(customStoryline);
      setShowCustomStory(false);
      setCustomStoryPrompt("");
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleResetProfile = async () => {
    localStorage.removeItem("personalityProfile");
    localStorage.removeItem("totalStoryCards");
    localStorage.removeItem("storyUsageCount");
    localStorage.removeItem("autumn-customer-id");
    localStorage.removeItem("proCreditsGranted");
    localStorage.removeItem("savedStories");
    localStorage.removeItem("accessibility-textSize");
    localStorage.removeItem("accessibility-highContrast");
    localStorage.removeItem("accessibility-dyslexiaFriendly");
    localStorage.removeItem("accessibility-clickableWords");
    setUserProfile(null);
    setTextSize('medium');
    setHighContrast(false);
    setDyslexiaFriendly(false);
    setClickableWords(false);
    setShowResetPopup(false);
    setShowQuiz(true);
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScores({ explorer: 0, philosopher: 0, survivor: 0, caregiver: 0 });
    setTotalStoryCards(0);
    setSavedStories([]);
    setIsProUser(false);
    
    // Reset credits to fresh 5 credits
    if (typeof window !== 'undefined') {
      // Clear all story data
      localStorage.removeItem("totalStoryCards");
      localStorage.removeItem("storyUsageCount");
      
      // Reset to fresh 5 credits (0 used)
      setLocalUsageCount(0);
      localStorage.setItem("storyUsageCount", "0");
      console.log("Reset complete - Fresh 5 credits available (0 used)");
      
      // Reload page to get fresh Autumn customer
      window.location.reload();
    }
  };

  const handleQuizAnswer = (archetype: string) => {
    setScores(prev => ({ ...prev, [archetype]: prev[archetype as keyof typeof prev] + 1 }));
    
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Show setup popup for 4 seconds
      setShowSetupPopup(true);
      setTimeout(() => {
        // Quiz complete, calculate final profile
        const finalProfile = Object.entries(scores).reduce((a, b) => 
          (a[1] > b[1] ? a : b)
        )[0];
        
        localStorage.setItem("personalityProfile", finalProfile);
        setUserProfile(finalProfile);
        
        // Update preferences with archetype
        UserPreferencesManager.setArchetype(finalProfile);
        LearningSystem.trackPreferenceChange('archetype', finalProfile, 'quiz');
        
        setShowQuiz(false);
        setQuizStarted(false);
        setShowSetupPopup(false);
      }, 4000);
    }
  };


  const handleStreamingStory = async (storyline: Storyline) => {
    // Clear all story data when selecting a different storyline
    setStoryCards([]);
    setCurrentParagraph(0);
    setStoryOptions([]);
    setShowOptions(false);
    setSelectedOption(null);
    setShowCustomStory(false);
    setCustomStoryPrompt("");
    
    setSelectedStoryline(storyline);
    setIsStreaming(true);
    setStreamingContent("");
    
    try {
      // Check if user has credits available
      if (localUsageCount >= getCreditLimit()) {
        console.log("User has reached the credit limit");
        setIsStreaming(false);
        return;
      }
      
      // Get context data
      let contextData = null;
      try {
        const { ContextDetector } = await import('@/lib/context-detector');
        contextData = await ContextDetector.getContextData();
      } catch (contextError) {
        console.log('Context detection failed, proceeding without context');
      }
      
      // Update local usage count
      setLocalUsageCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem("storyUsageCount", newCount.toString());
        console.log(`[handleStreamingStory] Incrementing usage count: ${prev} -> ${newCount}`);
        return newCount;
      });
      
      const response = await fetch("/api/stream-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: storyline.prompt, 
          profile: userProfile,
          mood,
          paragraphIndex: 0,
          useEmojis: useEmojis,
          locale: locale,
          context: contextData
        }),
      });
      
      if (!response.ok) throw new Error('Failed to stream story');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      
      let accumulatedContent = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        accumulatedContent += chunk;
        setStreamingContent(accumulatedContent);
      }
      
      setStoryCards(prev => [...prev, accumulatedContent]);
      setIsStreaming(false);
      setStreamingContent("");
      // Increment total story cards count for the first paragraph
      updateTotalStoryCards(1);
    } catch (err) {
      console.error('Streaming error:', err);
      setIsStreaming(false);
    }
  };

  const handleNextParagraph = async () => {
    if (isStreaming) return;
    
    setIsStreaming(true);
    setStreamingContent("");
    
    try {
      // Check if user has credits available
      if (localUsageCount >= getCreditLimit()) {
        console.log("User has reached the credit limit");
        setIsStreaming(false);
        return;
      }
      
      // Update local usage count
      setLocalUsageCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem("storyUsageCount", newCount.toString());
        console.log(`[handleNextParagraph] Incrementing usage count: ${prev} -> ${newCount}`);
        return newCount;
      });
      
      // Get context data for continuation
      let contextData = null;
      try {
        const { ContextDetector } = await import('@/lib/context-detector');
        contextData = await ContextDetector.getContextData();
      } catch (contextError) {
        console.log('Context detection failed, proceeding without context');
      }
      
      const response = await fetch("/api/stream-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: selectedStoryline!.prompt, 
          profile: userProfile,
          mood,
          paragraphIndex: currentParagraph + 1,
          previousParagraphs: storyCards,
          locale: locale,
          context: contextData
        }),
      });
      
      if (!response.ok) throw new Error('Failed to stream story');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      
      let accumulatedContent = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        accumulatedContent += chunk;
        setStreamingContent(accumulatedContent);
      }
      
      setStoryCards(prev => [...prev, accumulatedContent]);
      setCurrentParagraph(prev => prev + 1);
      setIsStreaming(false);
      setStreamingContent("");
      setSelectedOption(null);
      // Increment total story cards count
      updateTotalStoryCards(1);
      
      // Check if story is complete (after 3 paragraphs) and auto-save
      const newStoryCards = [...storyCards, accumulatedContent];
      if (newStoryCards.length >= 3) {
        // Auto-save the story
        saveStory(selectedStoryline!.title, newStoryCards, userProfile || 'default');
      }
      
      // Generate story options after completing a paragraph
      await generateStoryOptions();
    } catch (err) {
      console.error('Streaming error:', err);
      setIsStreaming(false);
    }
  };

  const generateStoryOptions = async () => {
    try {
      const response = await fetch("/api/generate-story-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: selectedStoryline!.prompt, 
          profile: userProfile,
          storySoFar: storyCards.join('\n\n'),
          currentParagraph: storyCards[storyCards.length - 1],
          locale: locale
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate options');
      
      const data = await response.json();
      setStoryOptions(data.options || []);
      setShowOptions(true);
    } catch (err) {
      console.error('Options generation error:', err);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };



  if (showQuiz && !showSetupPopup) {
  return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="bg-white p-12 rounded-xl max-w-lg w-full mx-4 shadow-2xl">
          {!quizStarted ? (
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6 text-gray-900 tracking-tight">{t('quiz.title')}</h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">Discover your unique story personality and unlock personalized narratives</p>
              <button
                onClick={startQuiz}
                className="bg-black text-white px-6 py-3 rounded-full font-medium text-base hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Get Started
              </button>
        </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">{t('quiz.personalityQuiz')}</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">
                  {QUIZ_QUESTIONS[currentQuestion].question}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(option.archetype)}
                      className="group relative p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                          {option.text.split(' ')[0]}
                        </div>
                        <div className="text-sm text-gray-600 font-medium leading-tight">
                          {option.text.split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                {t('quiz.questionOf', { current: currentQuestion + 1, total: QUIZ_QUESTIONS.length })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (showSetupPopup) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl animate-pulse transform transition-all duration-1000 hover:scale-110"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('quiz.settingUp')}</h2>
          <p className="text-gray-600">{t('quiz.preparing')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <CustomerInit />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-black">{t('quiz.title')}</h1>
              
              {/* Customer ID - Debug info */}
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                ID: {customerId || 'Loading...'}
              </div>
            </div>
                        <div className="flex items-center gap-4">
              <LanguageSelector 
                currentLocale={locale} 
                onLocaleChange={setLocale}
              />
              
              {/* Context Display */}
              <ContextDisplay />
              
              {/* Story Usage Count */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Stories Credit:</span>
                <span className={`font-semibold ${theme.primary}`}>
                  {Math.max(0, getCreditLimit() - localUsageCount)}
                </span>
              </div>

              {/* Pro Badge - Show when Pro product is attached */}
              {isProUser && (
                <div className="flex items-center gap-1">
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full font-semibold shadow-sm">
                    PRO
                  </span>
                </div>
              )}

              {/* Pro Upgrade Button - Show when credits are 0 */}
              {localUsageCount >= getCreditLimit() && !isProUser && (
                <button
                  onClick={() => setShowProUpgradeModal(true)}
                  className="bg-amber-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  Get More Credits
                </button>
              )}
              
              {userProfile && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{t('profile.stories')}</span>
                    <span className={`font-semibold ${theme.primary}`}>{totalStoryCards}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">{t('profile.profile')}</span> 
                    <span className={`ml-1 font-semibold capitalize ${theme.primary}`}>{userProfile}</span>
                  </span>
                                <button
                onClick={() => setShowResetPopup(true)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
              >
                {t('profile.reset')}
              </button>
              <button
                onClick={() => setShowUserSettings(true)}
                className="text-xs bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full transition-colors"
                title="Personalization Settings"
              >
                ⚙️
              </button>
              <button
                onClick={() => {
                  const moods = ['neutral', 'happy', 'sad', 'excited', 'relaxed'];
                  setMood(moods[(moods.indexOf(mood) + 1) % moods.length] as typeof mood);
                }}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  mood === 'neutral' ? 'bg-gray-100 text-gray-600' :
                  mood === 'happy' ? 'bg-yellow-100 text-yellow-700' :
                  mood === 'sad' ? 'bg-blue-100 text-blue-700' :
                  mood === 'excited' ? 'bg-pink-100 text-pink-700' :
                  'bg-green-100 text-green-700'
                }`}
                title="Toggle Mood"
              >
                {mood === 'neutral' && '😐'}
                {mood === 'happy' && '😊'}
                {mood === 'sad' && '😢'}
                {mood === 'excited' && '🤩'}
                {mood === 'relaxed' && '😌'}
              </button>
                </>
              )}
              </div>
          </div>
        </div>
      </nav>
      
      {userProfile && (
        <div className="h-16"></div>
      )}
      
      {showResetPopup && (
        <div className="fixed inset-0 bg-gray-500/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">{t('profile.resetPreferences')}</h3>
            <p className="text-gray-600 mb-6">
              {t('profile.resetDescription')}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetPopup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('profile.cancel')}
              </button>
              <button
                onClick={() => handleResetProfile()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                {t('profile.reset')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="h-full px-8 pt-4 pb-4">
        <div className="flex h-full gap-4">
          {/* Left Sidebar */}
          <div className="w-72 bg-white rounded-lg shadow-lg p-4 overflow-y-auto flex-shrink-0">
            {/* Tab Navigation */}
            <div className="flex mb-4 border-b border-gray-200">
              <button
                onClick={() => setSidebarTab('starters')}
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  sidebarTab === 'starters'
                    ? `${theme.primary} border-b-2 border-current`
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📚 Starters
              </button>
              <button
                onClick={() => setSidebarTab('saved')}
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  sidebarTab === 'saved'
                    ? `${theme.primary} border-b-2 border-current`
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                💾 Saved
              </button>
            </div>
            
            {/* Story Starters Tab */}
            {sidebarTab === 'starters' && (
              <>
                <h2 className={`text-xl font-bold mb-4 ${theme.primary}`}>{t('storyStarters.title')}</h2>
                
                {/* Custom Story Section */}
                <div className="mb-4">
              {!showCustomStory ? (
                <button
                  onClick={() => setShowCustomStory(true)}
                  disabled={localUsageCount >= getCreditLimit()}
                  className={`w-full p-3 rounded-lg border-2 border-dashed transition-all text-sm font-medium ${
                    localUsageCount >= getCreditLimit()
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                      : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {t('story.startYourOwnStory')}
                  {localUsageCount >= getCreditLimit() && (
                    <div className="text-xs text-red-500 mt-1">
                      ⚠️ No credits remaining
                    </div>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">{t('story.yourStoryIdea')}</h3>
                    <button
                      onClick={() => {
                        setShowCustomStory(false);
                        setCustomStoryPrompt("");
                      }}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <textarea
                    value={customStoryPrompt}
                    onChange={(e) => setCustomStoryPrompt(e.target.value)}
                    placeholder={t('story.describeStory')}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleStartCustomStory}
                    disabled={!customStoryPrompt.trim()}
                    className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${
                      customStoryPrompt.trim()
                        ? `${theme.button} text-white hover:scale-105`
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {t('story.startStory')}
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {(userProfile ? STORYLINES_BY_ARCHETYPE[userProfile as keyof typeof STORYLINES_BY_ARCHETYPE] || DEFAULT_STORYLINES : DEFAULT_STORYLINES).map((storyline, index) => (
                <button
                  key={index}
                  onClick={() => handleStreamingStory(storyline)}
                  disabled={localUsageCount >= getCreditLimit()}
                  className={`w-full text-left p-2 rounded-lg border transition-all ${
                    localUsageCount >= getCreditLimit()
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200'
                      : selectedStoryline?.title === storyline.title 
                      ? `${theme.button} text-white hover:scale-105` 
                      : `border-gray-200 bg-white hover:${theme.accent} hover:border-${theme.primary.split('-')[1]}-300 hover:scale-105`
                  }`}
                >
                  <h3 className="font-semibold text-sm mb-0.5">{getTranslatedStoryTitle(storyline.title)}</h3>
                  <p className="text-xs opacity-75 leading-tight">{storyline.prompt}</p>
                  {localUsageCount >= getCreditLimit() && (
                    <div className="text-xs text-red-500 mt-1">
                      ⚠️ No credits remaining. Get more credits to continue.
                    </div>
                  )}
                </button>
              ))}
            </div>
              </>
            )}
            
            {/* Saved Stories Tab */}
            {sidebarTab === 'saved' && (
              <>
                <h2 className={`text-xl font-bold mb-4 ${theme.primary}`}>Saved Stories</h2>
                
                {savedStories.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📖</div>
                    <p className="text-gray-500 text-sm">No saved stories yet</p>
                    <p className="text-gray-400 text-xs mt-1">Complete a story to save it here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedStories.map((story) => (
                      <div
                        key={story.id}
                        className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm text-gray-800">{story.title}</h3>
                          <button
                            onClick={() => deleteSavedStory(story.id)}
                            className="text-gray-400 hover:text-red-500 text-xs"
                            title="Delete story"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{story.date}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => loadSavedStory(story)}
                            className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-all ${
                              theme.button
                            } text-white hover:scale-105`}
                          >
                            Load Story
                          </button>
                          <span className="text-xs text-gray-400 capitalize">{story.archetype}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Right Canvas */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-4 overflow-hidden">
            {!selectedStoryline ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <img 
                    src="/view.png" 
                    alt="Story Selection" 
                    className="w-64 h-64 mx-auto mb-4 object-contain"
                  />
                  <h2 className={`text-2xl font-bold mb-4 ${theme.primary}`}>{t('story.chooseStory')}</h2>
                  <p className="text-gray-600">{t('story.selectStoryline')}</p>
                </div>
              </div>
            ) : (
              <div className="flex h-full overflow-hidden">
                {/* Story Content */}
                <div className="flex-1 space-y-4 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-2xl font-bold ${theme.primary}`}>{getTranslatedStoryTitle(selectedStoryline.title)}</h2>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setUseEmojis(!useEmojis)}
                        className={`px-2 py-1 rounded-lg text-sm font-medium transition-all ${
                          useEmojis 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {useEmojis ? t('story.emojisOn') : t('story.emojisOff')}
                      </button>
                      
                      {/* Accessibility Features */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleTextSizeChange}
                          className="px-2 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-all"
                          title="Change text size"
                        >
                          {textSize === 'small' ? 'A' : textSize === 'medium' ? 'AA' : 'AAA'}
                        </button>
                        
                        <button
                          onClick={handleHighContrastToggle}
                          className={`px-2 py-1 rounded-lg text-sm font-medium transition-all ${
                            highContrast 
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                          title="High contrast mode"
                        >
                          🌙
                        </button>
                        
                        <button
                          onClick={handleDyslexiaFriendlyToggle}
                          className={`px-2 py-1 rounded-lg text-sm font-medium transition-all ${
                            dyslexiaFriendly 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                          title="Dyslexia-friendly font"
                        >
                          📖
                        </button>
                        
                        <button
                          onClick={handleClickableWordsToggle}
                          className={`px-2 py-1 rounded-lg text-sm font-medium transition-all ${
                            clickableWords 
                              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                          title="Clickable words"
                        >
                          👆
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedStoryline(null);
                          setStoryCards([]);
                          setCurrentParagraph(0);
                          setStoryOptions([]);
                          setShowOptions(false);
                          setSelectedOption(null);
                          setShowCustomStory(false);
                          setCustomStoryPrompt("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  {/* Story Card Display */}
                  <div className="flex-1 flex items-center justify-center overflow-hidden">
                    {storyCards.length === 0 && !isStreaming ? (
                      <div className="text-center">
                        <p className="text-gray-500 text-lg">{t('story.clickToBegin')}</p>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {/* Current Card */}
                        {storyCards.length > 0 && !isStreaming && (
                          <div className={`rounded-xl p-6 shadow-lg max-w-6xl h-full ${
                            highContrast 
                              ? 'bg-black border border-gray-600' 
                              : `${theme.accent} border ${theme.border}`
                          } ${
                            textSize === 'large' ? 'overflow-y-auto max-h-[80vh]' : 'overflow-hidden'
                          }`}>
                            <div className={`leading-relaxed whitespace-pre-wrap ${
                              textSize === 'small' ? 'text-lg' : 
                              textSize === 'medium' ? 'text-2xl' : 
                              'text-3xl'
                            } ${
                              dyslexiaFriendly ? 'font-sans tracking-wide' : ''
                            } ${
                              highContrast ? 'text-white' : ''
                            }`}>
                              {renderClickableWords(storyCards[currentParagraph])}
                            </div>
                          </div>
                        )}
                        
                        {/* Streaming Content */}
                        {isStreaming && (
                          <div className={`rounded-xl p-6 shadow-lg max-w-6xl h-full ${
                            highContrast 
                              ? 'bg-black border border-gray-600' 
                              : `${theme.accent} border ${theme.border}`
                          } ${
                            textSize === 'large' ? 'overflow-y-auto max-h-[80vh]' : 'overflow-hidden'
                          }`}>
                            <div className={`leading-relaxed whitespace-pre-wrap ${
                              textSize === 'small' ? 'text-lg' : 
                              textSize === 'medium' ? 'text-2xl' : 
                              'text-3xl'
                            } ${
                              dyslexiaFriendly ? 'font-sans tracking-wide' : ''
                            } ${
                              highContrast ? 'text-white' : ''
                            }`}>
                              {renderClickableWords(streamingContent)}
                              <span className="animate-pulse">|</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Navigation Sidebar */}
                <div className="w-56 bg-gray-50 rounded-lg p-3 ml-3 flex-shrink-0 overflow-y-auto">
                  <h3 className={`text-lg font-semibold mb-4 ${theme.primary}`}>{t('navigation.navigation')}</h3>
                  
                  {/* Navigation Buttons */}
                  <div className="space-y-2">
                    {storyCards.length === 0 && !isStreaming && (
                      <button
                        onClick={() => handleStreamingStory(selectedStoryline!)}
                        disabled={localUsageCount >= getCreditLimit()}
                        className={`w-full py-2 rounded-lg font-semibold transition-all ${
                          localUsageCount >= getCreditLimit()
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'
                        }`}
                      >
                        {localUsageCount >= getCreditLimit() ? 'Story Limit Reached' : t('story.startStory')}
                      </button>
                    )}
                    
                    {storyCards.length > 0 && !isStreaming && currentParagraph > 0 && (
                      <button
                        onClick={() => setCurrentParagraph(prev => Math.max(0, prev - 1))}
                        className={`${theme.button} text-white w-full py-2 rounded-lg font-semibold transition-all hover:scale-105`}
                      >
                        {t('story.previous')}
                      </button>
                    )}
                    
                    {storyCards.length > 0 && !isStreaming && currentParagraph < storyCards.length - 1 && (
                      <button
                        onClick={() => setCurrentParagraph(prev => prev + 1)}
                        className={`${theme.button} text-white w-full py-2 rounded-lg font-semibold hover:scale-105 transition-all`}
                      >
                        {t('story.next')}
                      </button>
                    )}
                    
                    {storyCards.length > 0 && !isStreaming && currentParagraph === storyCards.length - 1 && (
                      <button
                        onClick={handleNextParagraph}
                        disabled={localUsageCount >= getCreditLimit()}
                        className={`w-full py-2 rounded-lg font-semibold transition-all ${
                          localUsageCount >= getCreditLimit()
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'
                        }`}
                      >
                        {localUsageCount >= getCreditLimit() ? 'Story Limit Reached' : t('story.continueStory')}
                      </button>
                    )}
                    
                    {isStreaming && (
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-gray-600">{t('story.generating')}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Story Continuation Options */}
                  {showOptions && storyOptions.length > 0 && (
                    <div className="mt-4">
                      <h4 className={`text-xs font-semibold mb-2 ${theme.primary}`}>{t('navigation.whatHappensNext')}</h4>
                      <div className="space-y-1.5">
                        {storyOptions.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionSelect(option)}
                            className={`w-full text-left p-1.5 rounded border transition-all text-sm leading-tight ${
                              selectedOption === option
                                ? 'bg-blue-50 border-blue-300 text-blue-800'
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <div className={`w-3 h-3 rounded-full border-2 ${
                                selectedOption === option
                                  ? 'bg-blue-500 border-blue-500'
                                  : 'border-gray-300'
                              }`}></div>
                              {option}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 leading-tight">
                        {t('navigation.selectOptionContinue')}
                      </div>
                    </div>
                  )}
                  
                  {/* Card Counter */}
                  {storyCards.length > 0 && (
                    <div className="mt-3 p-2 bg-white rounded-lg">
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{t('navigation.progress')}</div>
                        <div className="text-lg font-semibold">{currentParagraph + 1} / {storyCards.length}</div>
                        <div className="text-xs text-gray-500 mt-1">{t('navigation.paragraphOf', { current: currentParagraph + 1, total: storyCards.length })}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Save Story Button */}
                  {storyCards.length > 0 && !isStreaming && (
                    <div className="mt-3">
                      <button
                        onClick={() => saveStory(selectedStoryline!.title, storyCards, userProfile || 'default')}
                        className={`w-full py-2 rounded-lg font-semibold transition-all ${
                          theme.button
                        } text-white hover:scale-105`}
                      >
                        💾 Save Story
                      </button>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Save this story to your library
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white px-8 py-4 mt-8">
          <TamboClientProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY as string}>
            <MessageThreadCollapsible />
          </TamboClientProvider>
        </div>
      </main>
      
      {/* Pro Upgrade Modal */}
      <ProUpgradeModal 
        isOpen={showProUpgradeModal}
        onClose={() => {
          setShowProUpgradeModal(false);
          // Refresh usage count after modal closes
          const savedUsageCount = localStorage.getItem("storyUsageCount");
          if (savedUsageCount) {
            setLocalUsageCount(parseInt(savedUsageCount));
          }
        }}
      />

      {/* User Settings Modal */}
      <UserSettings 
        isOpen={showUserSettings}
        onClose={() => setShowUserSettings(false)}
        onPreferencesUpdate={() => {
          // Refresh any UI elements that depend on preferences
          const prefs = UserPreferencesManager.getPreferences();
          if (prefs.archetype) {
            setUserProfile(prefs.archetype);
          }
        }}
      />
      
      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Story saved successfully!</span>
          </div>
        </div>
      )}

      {/* Word Definition Popup */}
      {wordPopup && wordPopup.isOpen && (
        <div 
          className="fixed bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-50 max-w-sm"
          style={{
            left: `${wordPopup.position.x}px`,
            top: `${wordPopup.position.y + 20}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-blue-600">{wordPopup.word}</h3>
            <button 
              onClick={() => setWordPopup(null)}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {wordPopup.definition}
          </p>
        </div>
      )}
    </div>
  );
}