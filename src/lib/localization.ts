// Client-side localization with fallback translations
// For now, we'll use hardcoded translations until the API is set up

// Define the content that needs to be localized
export const LOCALIZATION_CONTENT = {
  // Quiz content
  quiz: {
    title: "🎭 PlotWeaver",
    welcome: "Welcome to your personalized story experience!",
    description: "Let's discover your reading personality to create stories that resonate with you. Take a quick 5-question quiz to unlock personalized storytelling.",
    startQuiz: "Start Quiz →",
    personalityQuiz: "Personality Quiz",
    helpText: "Help us understand your reading preferences to personalize your stories.",
    questionOf: "Question {current} of {total}",
    settingUp: "Setting things up...",
    preparing: "Preparing your personalized experience",
  },
  
  // Story content
  story: {
    chooseStory: "Choose a Story",
    selectStoryline: "Select a storyline from the sidebar to begin your adventure",
    startYourOwnStory: "✨ Start Your Own Story",
    yourStoryIdea: "Your Story Idea",
    describeStory: "Describe your story idea here...",
    startStory: "Start Story",
    clickToBegin: "Click \"Start Story\" to begin",
    emojisOn: "😊 Emojis On",
    emojisOff: "😐 Emojis Off",
    continueStory: "Continue Story →",
    generating: "Generating...",
    previous: "← Previous",
    next: "Next →",
  },
  
  // Navigation and UI
  navigation: {
    navigation: "Navigation",
    progress: "Progress",
    paragraphOf: "Paragraph {current} of {total}",
    whatHappensNext: "What happens next?",
    selectOptionContinue: "Select an option, then click \"Continue Story\" to proceed",
  },
  
  // Story starters
  storyStarters: {
    title: "Story Starters",
    lostCityAtlantis: "Lost City of Atlantis",
    spaceColonyExodus: "Space Colony Exodus",
    timeTravelerDilemma: "Time Traveler's Dilemma",
    dragonRiderAcademy: "Dragon Rider Academy",
    mirrorOfTruth: "The Mirror of Truth",
    dreamsOfCollective: "Dreams of the Collective",
    lastLibrary: "The Last Library",
    consciousnessTransfer: "Consciousness Transfer",
    nuclearWinter: "Nuclear Winter",
    prisonBreak: "Prison Break",
    zombieApocalypse: "Zombie Apocalypse",
    economicCollapse: "Economic Collapse",
    healingGarden: "The Healing Garden",
    fosterFamilyBonds: "Foster Family Bonds",
    animalSanctuary: "Animal Sanctuary",
    memoryCare: "Memory Care",
    mysteryManor: "Mystery Manor",
    cyberpunkDreams: "Cyberpunk Dreams",
    fantasyQuest: "Fantasy Quest",
    romanceInParis: "Romance in Paris",
  },
  
  // Profile and settings
  profile: {
    stories: "Stories:",
    profile: "Profile:",
    reset: "Reset",
    resetPreferences: "Reset Preferences",
    resetDescription: "This will clear your personality profile and restart the quiz. Are you sure?",
    cancel: "Cancel",
  },
  
  // Quiz questions
  questions: {
    storyEnding: "How do you prefer stories to end?",
    worldProcessing: "Which word best describes how you process the world?",
    setting: "Choose a setting you'd enjoy reading about:",
    emotionalIntensity: "How do you feel about emotional intensity in stories?",
    language: "What kind of language do you prefer in books?",
  },
  
  // Quiz options
  options: {
    hopeAdventure: "🟡 With a sense of hope or adventure",
    ambiguous: "⚫ Ambiguous and open to interpretation",
    realistic: "🔴 Realistic or even tragic, as long as it's honest",
    uplifting: "🟢 Uplifting and emotionally satisfying",
    wonder: "🌈 Wonder",
    reflection: "🔍 Reflection",
    survival: "🔥 Survival",
    connection: "💞 Connection",
    alienRuins: "🚀 A crew exploring alien ruins",
    mistyTemple: "⛩️ A lone monk in a misty temple",
    warZone: "🏚️ A refugee escaping a war zone",
    remoteVillage: "🏡 A nurse caring for a remote village",
    someEmotion: "🟢 Some is good, but I prefer action or ideas",
    deepEmotion: "⚫ I want deep emotion, but expressed subtly",
    rawHonesty: "🔴 Give me raw, painful honesty",
    warmthConnection: "💗 I want warmth, connection, and healing",
    simpleEnergetic: "✈️ Simple, energetic, quick to read",
    richMetaphors: "🌌 Rich metaphors and layered prose",
    minimalistPunchy: "🪨 Minimalist, punchy, brutally clear",
    flowingKind: "🍃 Flowing, kind, and emotionally nuanced",
  },
};

// Supported locales
export const SUPPORTED_LOCALES = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
  ar: "العربية",
};

export type Locale = keyof typeof SUPPORTED_LOCALES;

// Localization context type
export interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translateObject: <T extends Record<string, any>>(obj: T) => Promise<T>;
}

// Sample translations for demonstration
const SAMPLE_TRANSLATIONS = {
  es: {
    quiz: {
      title: "🎭 Tejedor de Historias",
      welcome: "¡Bienvenido a tu experiencia de historias personalizada!",
      description: "Descubramos tu personalidad de lectura para crear historias que resuenen contigo. Toma un cuestionario rápido de 5 preguntas para desbloquear la narración personalizada.",
      startQuiz: "Comenzar Cuestionario →",
      personalityQuiz: "Cuestionario de Personalidad",
      helpText: "Ayúdanos a entender tus preferencias de lectura para personalizar tus historias.",
      questionOf: "Pregunta {current} de {total}",
      settingUp: "Configurando...",
      preparing: "Preparando tu experiencia personalizada",
    },
    story: {
      chooseStory: "Elegir una Historia",
      selectStoryline: "Selecciona una historia del panel lateral para comenzar tu aventura",
      startYourOwnStory: "✨ Comienza Tu Propia Historia",
      yourStoryIdea: "Tu Idea de Historia",
      describeStory: "Describe tu idea de historia aquí...",
      startStory: "Comenzar Historia",
      clickToBegin: "Haz clic en \"Comenzar Historia\" para empezar",
      emojisOn: "😊 Emojis Activados",
      emojisOff: "😐 Emojis Desactivados",
      continueStory: "Continuar Historia →",
      generating: "Generando...",
      previous: "← Anterior",
      next: "Siguiente →",
    },
    navigation: {
      navigation: "Navegación",
      progress: "Progreso",
      paragraphOf: "Párrafo {current} de {total}",
      whatHappensNext: "¿Qué pasa después?",
      selectOptionContinue: "Selecciona una opción, luego haz clic en \"Continuar Historia\" para proceder",
    },
    storyStarters: {
      title: "Iniciadores de Historias",
      lostCityAtlantis: "Ciudad Perdida de la Atlántida",
      spaceColonyExodus: "Éxodo de la Colonia Espacial",
      timeTravelerDilemma: "El Dilema del Viajero del Tiempo",
      dragonRiderAcademy: "Academia de Jinete de Dragones",
      mirrorOfTruth: "El Espejo de la Verdad",
      dreamsOfCollective: "Sueños del Colectivo",
      lastLibrary: "La Última Biblioteca",
      consciousnessTransfer: "Transferencia de Conciencia",
      nuclearWinter: "Invierno Nuclear",
      prisonBreak: "Fuga de Prisión",
      zombieApocalypse: "Apocalipsis Zombi",
      economicCollapse: "Colapso Económico",
      healingGarden: "El Jardín Curativo",
      fosterFamilyBonds: "Vínculos de Familia Adoptiva",
      animalSanctuary: "Santuario de Animales",
      memoryCare: "Cuidado de Memoria",
      mysteryManor: "Mansión Misteriosa",
      cyberpunkDreams: "Sueños Cyberpunk",
      fantasyQuest: "Búsqueda Fantástica",
      romanceInParis: "Romance en París",
    },
    profile: {
      stories: "Historias:",
      profile: "Perfil:",
      reset: "Reiniciar",
      resetPreferences: "Reiniciar Preferencias",
      resetDescription: "Esto borrará tu perfil de personalidad y reiniciará el cuestionario. ¿Estás seguro?",
      cancel: "Cancelar",
    },
  },
  fr: {
    quiz: {
      title: "🎭 Tisseur d'Histoires",
      welcome: "Bienvenue dans votre expérience d'histoires personnalisée !",
      description: "Découvrons votre personnalité de lecture pour créer des histoires qui vous parlent. Passez un quiz rapide de 5 questions pour débloquer la narration personnalisée.",
      startQuiz: "Commencer le Quiz →",
      personalityQuiz: "Quiz de Personnalité",
      helpText: "Aidez-nous à comprendre vos préférences de lecture pour personnaliser vos histoires.",
      questionOf: "Question {current} sur {total}",
      settingUp: "Configuration en cours...",
      preparing: "Préparation de votre expérience personnalisée",
    },
    story: {
      chooseStory: "Choisir une Histoire",
      selectStoryline: "Sélectionnez une histoire dans la barre latérale pour commencer votre aventure",
      startYourOwnStory: "✨ Commencer Votre Propre Histoire",
      yourStoryIdea: "Votre Idée d'Histoire",
      describeStory: "Décrivez votre idée d'histoire ici...",
      startStory: "Commencer l'Histoire",
      clickToBegin: "Cliquez sur \"Commencer l'Histoire\" pour commencer",
      emojisOn: "😊 Emojis Activés",
      emojisOff: "😐 Emojis Désactivés",
      continueStory: "Continuer l'Histoire →",
      generating: "Génération...",
      previous: "← Précédent",
      next: "Suivant →",
    },
    navigation: {
      navigation: "Navigation",
      progress: "Progrès",
      paragraphOf: "Paragraphe {current} sur {total}",
      whatHappensNext: "Que se passe-t-il ensuite ?",
      selectOptionContinue: "Sélectionnez une option, puis cliquez sur \"Continuer l'Histoire\" pour continuer",
    },
    storyStarters: {
      title: "Démarreurs d'Histoires",
      lostCityAtlantis: "Cité Perdue d'Atlantis",
      spaceColonyExodus: "Exode de la Colonie Spatiale",
      timeTravelerDilemma: "Le Dilemme du Voyageur Temporel",
      dragonRiderAcademy: "Académie des Cavaliers de Dragons",
      mirrorOfTruth: "Le Miroir de la Vérité",
      dreamsOfCollective: "Rêves du Collectif",
      lastLibrary: "La Dernière Bibliothèque",
      consciousnessTransfer: "Transfert de Conscience",
      nuclearWinter: "Hiver Nucléaire",
      prisonBreak: "Évasion de Prison",
      zombieApocalypse: "Apocalypse Zombie",
      economicCollapse: "Effondrement Économique",
      healingGarden: "Le Jardin Guérisseur",
      fosterFamilyBonds: "Liens de Famille d'Accueil",
      animalSanctuary: "Sanctuaire Animal",
      memoryCare: "Soins de Mémoire",
      mysteryManor: "Manoir Mystérieux",
      cyberpunkDreams: "Rêves Cyberpunk",
      fantasyQuest: "Quête Fantastique",
      romanceInParis: "Romance à Paris",
    },
    profile: {
      stories: "Histoires:",
      profile: "Profil:",
      reset: "Réinitialiser",
      resetPreferences: "Réinitialiser les Préférences",
      resetDescription: "Cela effacera votre profil de personnalité et redémarrera le quiz. Êtes-vous sûr ?",
      cancel: "Annuler",
    },
  },
  de: {
    quiz: {
      title: "🎭 Geschichtenerzähler",
      welcome: "Willkommen bei Ihrer personalisierten Geschichtenerfahrung!",
      description: "Entdecken wir Ihre Lesepersönlichkeit, um Geschichten zu erstellen, die mit Ihnen in Resonanz stehen. Machen Sie einen schnellen 5-Fragen-Quiz, um personalisiertes Storytelling freizuschalten.",
      startQuiz: "Quiz Starten →",
      personalityQuiz: "Persönlichkeitsquiz",
      helpText: "Helfen Sie uns, Ihre Lesepräferenzen zu verstehen, um Ihre Geschichten zu personalisieren.",
      questionOf: "Frage {current} von {total}",
      settingUp: "Einrichtung läuft...",
      preparing: "Vorbereitung Ihrer personalisierten Erfahrung",
    },
    story: {
      chooseStory: "Geschichte Auswählen",
      selectStoryline: "Wählen Sie eine Geschichte aus der Seitenleiste, um Ihr Abenteuer zu beginnen",
      startYourOwnStory: "✨ Beginnen Sie Ihre Eigene Geschichte",
      yourStoryIdea: "Ihre Geschichtenidee",
      describeStory: "Beschreiben Sie Ihre Geschichtenidee hier...",
      startStory: "Geschichte Starten",
      clickToBegin: "Klicken Sie auf \"Geschichte Starten\" um zu beginnen",
      emojisOn: "😊 Emojis An",
      emojisOff: "😐 Emojis Aus",
      continueStory: "Geschichte Fortsetzen →",
      generating: "Generierung...",
      previous: "← Zurück",
      next: "Weiter →",
    },
    navigation: {
      navigation: "Navigation",
      progress: "Fortschritt",
      paragraphOf: "Absatz {current} von {total}",
      whatHappensNext: "Was passiert als nächstes?",
      selectOptionContinue: "Wählen Sie eine Option, dann klicken Sie auf \"Geschichte Fortsetzen\" um fortzufahren",
    },
    storyStarters: {
      title: "Geschichtenstarter",
      lostCityAtlantis: "Verlorene Stadt Atlantis",
      spaceColonyExodus: "Raumkolonie-Exodus",
      timeTravelerDilemma: "Das Dilemma des Zeitreisenden",
      dragonRiderAcademy: "Drachenreiter-Akademie",
      mirrorOfTruth: "Der Spiegel der Wahrheit",
      dreamsOfCollective: "Träume des Kollektivs",
      lastLibrary: "Die Letzte Bibliothek",
      consciousnessTransfer: "Bewusstseinsübertragung",
      nuclearWinter: "Nuklearer Winter",
      prisonBreak: "Gefängnisausbruch",
      zombieApocalypse: "Zombie-Apokalypse",
      economicCollapse: "Wirtschaftskollaps",
      healingGarden: "Der Heilende Garten",
      fosterFamilyBonds: "Pflegefamilien-Bindungen",
      animalSanctuary: "Tierschutzgebiet",
      memoryCare: "Gedächtnispflege",
      mysteryManor: "Geheimnisvolles Herrenhaus",
      cyberpunkDreams: "Cyberpunk-Träume",
      fantasyQuest: "Fantasy-Quest",
      romanceInParis: "Romance in Paris",
    },
    profile: {
      stories: "Geschichten:",
      profile: "Profil:",
      reset: "Zurücksetzen",
      resetPreferences: "Einstellungen Zurücksetzen",
      resetDescription: "Dies löscht Ihr Persönlichkeitsprofil und startet das Quiz neu. Sind Sie sicher?",
      cancel: "Abbrechen",
    },
  },
  it: {
    quiz: {
      title: "🎭 Tessitore di Storie",
      welcome: "Benvenuto nella tua esperienza di storie personalizzata!",
      description: "Scopriamo la tua personalità di lettura per creare storie che risuonino con te. Fai un quiz veloce di 5 domande per sbloccare la narrazione personalizzata.",
      startQuiz: "Inizia Quiz →",
      personalityQuiz: "Quiz di Personalità",
      helpText: "Aiutaci a capire le tue preferenze di lettura per personalizzare le tue storie.",
      questionOf: "Domanda {current} di {total}",
      settingUp: "Configurazione in corso...",
      preparing: "Preparazione della tua esperienza personalizzata",
    },
    story: {
      chooseStory: "Scegli una Storia",
      selectStoryline: "Seleziona una storia dalla barra laterale per iniziare la tua avventura",
      startYourOwnStory: "✨ Inizia la Tua Storia",
      yourStoryIdea: "La Tua Idea di Storia",
      describeStory: "Descrivi la tua idea di storia qui...",
      startStory: "Inizia Storia",
      clickToBegin: "Clicca su \"Inizia Storia\" per cominciare",
      emojisOn: "😊 Emoji Attive",
      emojisOff: "😐 Emoji Disattive",
      continueStory: "Continua Storia →",
      generating: "Generazione...",
      previous: "← Precedente",
      next: "Successivo →",
    },
    navigation: {
      navigation: "Navigazione",
      progress: "Progresso",
      paragraphOf: "Paragrafo {current} di {total}",
      whatHappensNext: "Cosa succede dopo?",
      selectOptionContinue: "Seleziona un'opzione, poi clicca su \"Continua Storia\" per procedere",
    },
    storyStarters: {
      title: "Iniziatori di Storie",
      lostCityAtlantis: "Città Perduta di Atlantide",
      spaceColonyExodus: "Esodo della Colonia Spaziale",
      timeTravelerDilemma: "Il Dilemma del Viaggiatore nel Tempo",
      dragonRiderAcademy: "Accademia dei Cavalieri di Draghi",
      mirrorOfTruth: "Lo Specchio della Verità",
      dreamsOfCollective: "Sogni del Collettivo",
      lastLibrary: "L'Ultima Biblioteca",
      consciousnessTransfer: "Trasferimento di Coscienza",
      nuclearWinter: "Inverno Nucleare",
      prisonBreak: "Fuga di Prigione",
      zombieApocalypse: "Apocalisse Zombie",
      economicCollapse: "Collasso Economico",
      healingGarden: "Il Giardino Curativo",
      fosterFamilyBonds: "Legami di Famiglia Adottiva",
      animalSanctuary: "Santuario degli Animali",
      memoryCare: "Cura della Memoria",
      mysteryManor: "Maniero Misterioso",
      cyberpunkDreams: "Sogni Cyberpunk",
      fantasyQuest: "Ricerca Fantastica",
      romanceInParis: "Romance a Parigi",
    },
    profile: {
      stories: "Storie:",
      profile: "Profilo:",
      reset: "Ripristina",
      resetPreferences: "Ripristina Preferenze",
      resetDescription: "Questo cancellerà il tuo profilo di personalità e riavvierà il quiz. Sei sicuro?",
      cancel: "Annulla",
    },
  },
  zh: {
    quiz: {
      title: "🎭 故事编织者",
      welcome: "欢迎来到您的个性化故事体验！",
      description: "让我们发现您的阅读个性，创造与您共鸣的故事。参加一个快速的5问题测验来解锁个性化讲故事。",
      startQuiz: "开始测验 →",
      personalityQuiz: "个性测验",
      helpText: "帮助我们了解您的阅读偏好来个性化您的故事。",
      questionOf: "第 {current} 题，共 {total} 题",
      settingUp: "正在设置...",
      preparing: "准备您的个性化体验",
    },
    story: {
      chooseStory: "选择一个故事",
      selectStoryline: "从侧边栏选择一个故事情节开始您的冒险",
      startYourOwnStory: "✨ 开始您自己的故事",
      yourStoryIdea: "您的故事想法",
      describeStory: "在此描述您的故事想法...",
      startStory: "开始故事",
      clickToBegin: "点击\"开始故事\"开始",
      emojisOn: "😊 表情符号开启",
      emojisOff: "😐 表情符号关闭",
      continueStory: "继续故事 →",
      generating: "生成中...",
      previous: "← 上一个",
      next: "下一个 →",
    },
    navigation: {
      navigation: "导航",
      progress: "进度",
      paragraphOf: "第 {current} 段，共 {total} 段",
      whatHappensNext: "接下来会发生什么？",
      selectOptionContinue: "选择一个选项，然后点击\"继续故事\"继续",
    },
    storyStarters: {
      title: "故事启动器",
      lostCityAtlantis: "失落的亚特兰蒂斯城",
      spaceColonyExodus: "太空殖民地出埃及记",
      timeTravelerDilemma: "时间旅行者的困境",
      dragonRiderAcademy: "龙骑士学院",
      mirrorOfTruth: "真理之镜",
      dreamsOfCollective: "集体的梦想",
      lastLibrary: "最后的图书馆",
      consciousnessTransfer: "意识转移",
      nuclearWinter: "核冬天",
      prisonBreak: "越狱",
      zombieApocalypse: "僵尸启示录",
      economicCollapse: "经济崩溃",
      healingGarden: "治愈花园",
      fosterFamilyBonds: "寄养家庭纽带",
      animalSanctuary: "动物保护区",
      memoryCare: "记忆护理",
      mysteryManor: "神秘庄园",
      cyberpunkDreams: "赛博朋克之梦",
      fantasyQuest: "奇幻冒险",
      romanceInParis: "巴黎浪漫",
    },
    profile: {
      stories: "故事:",
      profile: "档案:",
      reset: "重置",
      resetPreferences: "重置偏好",
      resetDescription: "这将清除您的个性档案并重新开始测验。您确定吗？",
      cancel: "取消",
    },
  },
  ja: {
    quiz: {
      title: "🎭 ストーリーテラー",
      welcome: "パーソナライズされたストーリー体験へようこそ！",
      description: "あなたの読書性格を発見して、あなたと共鳴するストーリーを作りましょう。5つの質問のクイズを受けて、パーソナライズされたストーリーテリングをアンロックしてください。",
      startQuiz: "クイズを開始 →",
      personalityQuiz: "性格クイズ",
      helpText: "あなたの読書好みを理解して、あなたのストーリーをパーソナライズするのを手伝ってください。",
      questionOf: "質問 {current} / {total}",
      settingUp: "セットアップ中...",
      preparing: "あなたのパーソナライズされた体験を準備中",
    },
    story: {
      chooseStory: "ストーリーを選択",
      selectStoryline: "サイドバーからストーリーラインを選択して冒険を始めましょう",
      startYourOwnStory: "✨ あなた自身のストーリーを始める",
      yourStoryIdea: "あなたのストーリーアイデア",
      describeStory: "ここであなたのストーリーアイデアを説明してください...",
      startStory: "ストーリーを開始",
      clickToBegin: "\"ストーリーを開始\"をクリックして始める",
      emojisOn: "😊 絵文字オン",
      emojisOff: "😐 絵文字オフ",
      continueStory: "ストーリーを続ける →",
      generating: "生成中...",
      previous: "← 前へ",
      next: "次へ →",
    },
    navigation: {
      navigation: "ナビゲーション",
      progress: "進捗",
      paragraphOf: "段落 {current} / {total}",
      whatHappensNext: "次に何が起こる？",
      selectOptionContinue: "オプションを選択してから\"ストーリーを続ける\"をクリックして続行",
    },
    storyStarters: {
      title: "ストーリースターター",
      lostCityAtlantis: "失われたアトランティス",
      spaceColonyExodus: "宇宙コロニーの出エジプト記",
      timeTravelerDilemma: "タイムトラベラーのジレンマ",
      dragonRiderAcademy: "ドラゴンライダーアカデミー",
      mirrorOfTruth: "真実の鏡",
      dreamsOfCollective: "集団の夢",
      lastLibrary: "最後の図書館",
      consciousnessTransfer: "意識転送",
      nuclearWinter: "核の冬",
      prisonBreak: "脱獄",
      zombieApocalypse: "ゾンビ黙示録",
      economicCollapse: "経済崩壊",
      healingGarden: "癒しの庭",
      fosterFamilyBonds: "里親家族の絆",
      animalSanctuary: "動物保護区",
      memoryCare: "記憶ケア",
      mysteryManor: "謎の屋敷",
      cyberpunkDreams: "サイバーパンクの夢",
      fantasyQuest: "ファンタジークエスト",
      romanceInParis: "パリのロマンス",
    },
    profile: {
      stories: "ストーリー:",
      profile: "プロフィール:",
      reset: "リセット",
      resetPreferences: "設定をリセット",
      resetDescription: "これによりあなたの性格プロフィールがクリアされ、クイズが再開されます。よろしいですか？",
      cancel: "キャンセル",
    },
  },
  ko: {
    quiz: {
      title: "🎭 스토리텔러",
      welcome: "개인화된 스토리 경험에 오신 것을 환영합니다!",
      description: "당신의 독서 성격을 발견하여 당신과 공감하는 스토리를 만들어봅시다. 빠른 5문제 퀴즈를 통해 개인화된 스토리텔링을 해제하세요.",
      startQuiz: "퀴즈 시작 →",
      personalityQuiz: "성격 퀴즈",
      helpText: "당신의 독서 선호도를 이해하여 당신의 스토리를 개인화하는 데 도움을 주세요.",
      questionOf: "질문 {current} / {total}",
      settingUp: "설정 중...",
      preparing: "당신의 개인화된 경험을 준비 중",
    },
    story: {
      chooseStory: "스토리 선택",
      selectStoryline: "사이드바에서 스토리라인을 선택하여 모험을 시작하세요",
      startYourOwnStory: "✨ 당신만의 스토리 시작하기",
      yourStoryIdea: "당신의 스토리 아이디어",
      describeStory: "여기서 당신의 스토리 아이디어를 설명하세요...",
      startStory: "스토리 시작",
      clickToBegin: "\"스토리 시작\"을 클릭하여 시작",
      emojisOn: "😊 이모지 켜기",
      emojisOff: "😐 이모지 끄기",
      continueStory: "스토리 계속하기 →",
      generating: "생성 중...",
      previous: "← 이전",
      next: "다음 →",
    },
    navigation: {
      navigation: "네비게이션",
      progress: "진행률",
      paragraphOf: "단락 {current} / {total}",
      whatHappensNext: "다음에 무슨 일이 일어날까요?",
      selectOptionContinue: "옵션을 선택한 후 \"스토리 계속하기\"를 클릭하여 진행",
    },
    storyStarters: {
      title: "스토리 스타터",
      lostCityAtlantis: "잃어버린 아틀란티스",
      spaceColonyExodus: "우주 식민지 출애굽기",
      timeTravelerDilemma: "시간 여행자의 딜레마",
      dragonRiderAcademy: "드래곤 라이더 아카데미",
      mirrorOfTruth: "진실의 거울",
      dreamsOfCollective: "집단의 꿈",
      lastLibrary: "마지막 도서관",
      consciousnessTransfer: "의식 전송",
      nuclearWinter: "핵겨울",
      prisonBreak: "탈옥",
      zombieApocalypse: "좀비 아포칼립스",
      economicCollapse: "경제 붕괴",
      healingGarden: "치유의 정원",
      fosterFamilyBonds: "위탁 가족의 유대",
      animalSanctuary: "동물 보호소",
      memoryCare: "기억 케어",
      mysteryManor: "미스터리 저택",
      cyberpunkDreams: "사이버펑크의 꿈",
      fantasyQuest: "판타지 퀘스트",
      romanceInParis: "파리의 로맨스",
    },
    profile: {
      stories: "스토리:",
      profile: "프로필:",
      reset: "재설정",
      resetPreferences: "설정 재설정",
      resetDescription: "이것은 당신의 성격 프로필을 지우고 퀴즈를 다시 시작합니다. 확실합니까?",
      cancel: "취소",
    },
  },
};

// Cache for translated content
const translationCache = new Map<string, any>();

// Main localization function
export async function localizeContent(
  content: Record<string, any>,
  targetLocale: Locale,
  sourceLocale: Locale = "en"
): Promise<Record<string, any>> {
  if (targetLocale === sourceLocale) {
    return content;
  }

  const cacheKey = `${sourceLocale}-${targetLocale}-${JSON.stringify(content)}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    // Use the API route instead of direct SDK
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        sourceLocale,
        targetLocale
      })
    });

    if (!response.ok) {
      throw new Error('Translation API failed');
    }

    const { translated } = await response.json();
    translationCache.set(cacheKey, translated);
    return translated;
  } catch (error) {
    console.error("Translation error:", error);
    return content; // Fallback to original content
  }
}

// Utility function to translate a specific key
export function translateKey(
  key: string,
  locale: Locale,
  params?: Record<string, string | number>
): string {
  // For now, return the English version
  // In a full implementation, this would use the cached translations
  let text = key;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, String(value));
    });
  }
  
  return text;
}

// Hook for React components
export function useLocalization() {
  const [locale, setLocale] = useState<Locale>("en");
  const [translations, setTranslations] = useState<Record<string, any>>(LOCALIZATION_CONTENT);

  useEffect(() => {
    if (locale === "en") {
      setTranslations(LOCALIZATION_CONTENT);
    } else if (SAMPLE_TRANSLATIONS[locale as keyof typeof SAMPLE_TRANSLATIONS]) {
      // Use sample translations for supported languages
      setTranslations(SAMPLE_TRANSLATIONS[locale as keyof typeof SAMPLE_TRANSLATIONS]);
    } else {
      // For unsupported languages, fall back to English gracefully
      console.warn(`Translation not available for locale: ${locale}, falling back to English`);
      setTranslations(LOCALIZATION_CONTENT);
    }
  }, [locale]);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    let text = String(value);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, String(value));
      });
    }
    
    return text;
  }, [translations]);

  const translateObject = useCallback(async <T extends Record<string, any>>(obj: T): Promise<T> => {
    if (locale === "en") return obj;
    const translated = await localizeContent(obj, locale);
    return translated as T;
  }, [locale]);

  return {
    locale,
    setLocale,
    t,
    translateObject,
  };
}

// Import React hooks
import { useState, useEffect, useCallback } from "react"; 