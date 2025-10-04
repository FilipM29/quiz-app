import { Quiz } from '../models/quiz';
import { Category } from '../types/category';

// Utility function to check if an icon string is a URL
export const isIconUrl = (icon: string): boolean => {
  try {
    new URL(icon);
    return true;
  } catch {
    return false;
  }
};

// Category detection based on quiz title and description
export const detectCategory = (quiz: Quiz): string => {
  const text = `${quiz.title} ${quiz.description}`.toLowerCase();

  // Science & Technology
  if (
    text.match(
      /(science|physics|chemistry|biology|technology|computer|math|mathematics|engineering)/
    )
  ) {
    return 'science';
  }

  // History & Culture
  if (
    text.match(
      /(history|historical|culture|ancient|war|civilization|century|past|heritage)/
    )
  ) {
    return 'history';
  }

  // Sports & Entertainment
  if (
    text.match(
      /(sport|football|basketball|soccer|olympic|game|movie|film|music|entertainment|celebrity)/
    )
  ) {
    return 'sports';
  }

  // Geography & Nature
  if (
    text.match(
      /(geography|country|city|world|nature|animal|planet|earth|travel|continent)/
    )
  ) {
    return 'geography';
  }

  // Literature & Art
  if (
    text.match(
      /(literature|book|author|art|painting|poetry|novel|artist|creative|writing)/
    )
  ) {
    return 'literature';
  }

  // Business & Economics
  if (
    text.match(
      /(business|economics|finance|market|money|economy|trade|company|corporate)/
    )
  ) {
    return 'business';
  }

  return 'general';
};

// Category configurations with colors and emojis
export const categoryConfig = {
  science: {
    name: 'Science & Tech',
    color: '#4F46E5', // Indigo
    emoji: '🧪',
    bgColor: '#EEF2FF'
  },
  history: {
    name: 'History',
    color: '#7C2D12', // Brown
    emoji: '🏛️',
    bgColor: '#FEF7ED'
  },
  sports: {
    name: 'Sports',
    color: '#059669', // Green
    emoji: '⚽',
    bgColor: '#ECFDF5'
  },
  geography: {
    name: 'Geography',
    color: '#0284C7', // Blue
    emoji: '🌍',
    bgColor: '#EFF6FF'
  },
  literature: {
    name: 'Literature',
    color: '#7E22CE', // Purple
    emoji: '📚',
    bgColor: '#FAF5FF'
  },
  business: {
    name: 'Business',
    color: '#DC2626', // Red
    emoji: '💼',
    bgColor: '#FEF2F2'
  },
  general: {
    name: 'General',
    color: '#6B7280', // Gray
    emoji: '🧠',
    bgColor: '#F9FAFB'
  }
};

// Generate SVG placeholder for a category using database category data
export const generateCategoryPlaceholder = (
  categoryData?: Category
): string => {
  // Use provided category data or fallback to general config
  const color = categoryData?.color || categoryConfig.general.color;
  const bgColor = `${color}10`; // Light background color

  // Always use a generic icon placeholder since external images in SVG data URLs
  // are often blocked by browsers for security reasons
  const iconElement = `<text x="200" y="105" font-family="system-ui" font-size="32" text-anchor="middle" fill="${color}">📝</text>`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="180" viewBox="0 0 400 180">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color}20;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="180" fill="url(#gradient)"/>
      <circle cx="200" cy="90" r="40" fill="${color}40" opacity="0.6"/>
      <circle cx="200" cy="90" r="25" fill="${color}60" opacity="0.8"/>
      ${iconElement}
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// Get placeholder image URL for a quiz
export const getQuizPlaceholder = (
  quiz: Quiz,
  categoryData?: Category
): string => {
  if (quiz.pictureUrl && quiz.pictureUrl.trim()) {
    return quiz.pictureUrl;
  }

  // Use provided category data if available, otherwise detect category and use fallback
  return generateCategoryPlaceholder(categoryData);
};

// Get category info for a quiz
export const getQuizCategory = (quiz: Quiz) => {
  const category = detectCategory(quiz);
  return (
    categoryConfig[category as keyof typeof categoryConfig] ||
    categoryConfig.general
  );
};
