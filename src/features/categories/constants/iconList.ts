//src/features/categories/constants/iconList.ts
export const CATEGORY_ICONS = [
  // Formats / mediums
  "Clapperboard",
  "Film",
  "Tv",
  "Tv2",
  "Video",
  "Camera",
  "Popcorn",
  "Ticket",
  "Disc3",
  "Album",
  "PlayCircle",
  "MonitorPlay",

  // Genres / moods
  "Ghost",
  "Skull",
  "Swords",
  "Wand2",
  "Rocket",
  "Bomb",
  "Flame",
  "Heart",
  "HeartCrack",
  "Laugh",
  "Drama",
  "Sparkles",
  "Zap",
  "Crown",
  "Shield",
  "Gem",
  "Music",
  "Mic2",
  "PartyPopper",

  // Themes / settings
  "Globe",
  "Globe2",
  "MapPin",
  "Compass",
  "Mountain",
  "Building2",
  "Landmark",
  "Trees",
  "Waves",
  "Sun",
  "Moon",
  "Star",
  "Rainbow",

  // People / groups
  "Users",
  "User",
  "Baby",
  "Cat",
  "Dog",

  // Language / region flags-as-concepts
  "Flag",
  "Languages",
  "BookOpen",

  // Status / meta
  "Clock",
  "History",
  "TrendingUp",
  "Award",
  "Trophy",
  "FolderHeart",
  "Bookmark",
  "Eye",
  "EyeOff",

  // System (used internally, e.g. Uncategorized)
  "FolderX",
] as const;

export type CategoryIconName = (typeof CATEGORY_ICONS)[number];
