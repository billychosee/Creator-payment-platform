// Zimbabwe National Colors Configuration
// 🇿🇼 Based on Zimbabwe flag colors: Green, Yellow, Red, Black, White

export const zimbabweColors = {
  // Primary Brand Colors (Zimbabwe Flag Colors)
  primary: {
    green: "#22C55E", // Agriculture/prosperity
    gold: "#EAB308",  // Mineral wealth
    red: "#DC2626",   // Liberation/heritage
    black: "#000000", // Black majority
    white: "#FFFFFF", // Peace
  },

  // Tailwind Color Mappings (Easy to change)
  gradients: {
    // Primary Actions (Main CTAs)
    primary: "from-green-600 to-yellow-500", // Agriculture Gold theme
    secondary: "from-red-600 to-yellow-500", // Liberation Pride
    accent: "from-yellow-600 to-orange-500", // Rich Heritage
    premium: "from-gray-800 to-black",       // Unity Power

    // Secondary Actions (Less prominent)
    neutral: "from-green-400 to-green-600",  // Peaceful Green
    subtle: "from-yellow-400 to-yellow-600", // Warm Gold
    muted: "from-red-500 to-red-700",        // Strong Red

    // Special Purpose
    success: "from-green-500 to-yellow-500", // Growth/Prosperity
    warning: "from-yellow-500 to-red-500",   // Attention
    dark: "from-gray-700 to-black",          // Premium features

    // Background Gradients
    hero: "from-green-50 to-yellow-50",      // Agriculture background
    card: "from-red-50 to-yellow-50",        // Card backgrounds
    section: "from-gray-50 to-white",        // Section backgrounds
  },

  // Button Variants
  buttons: {
    primary: "bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600",
    secondary: "bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600",
    accent: "bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-700 hover:to-orange-600",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
    ghost: "text-green-600 hover:bg-green-50",
    premium: "bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-black",
  },

  // Semantic Colors
  semantic: {
    success: {
      bg: "bg-gradient-to-r from-green-500 to-yellow-500",
      text: "text-green-700",
      border: "border-green-200",
      light: "bg-green-50",
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-500 to-red-500",
      text: "text-yellow-700", 
      border: "border-yellow-200",
      light: "bg-yellow-50",
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-red-700",
      text: "text-red-700",
      border: "border-red-200", 
      light: "bg-red-50",
    },
    info: {
      bg: "bg-gradient-to-r from-green-400 to-yellow-400",
      text: "text-green-700",
      border: "border-green-200",
      light: "bg-green-50",
    },
  },
};

// Export individual colors for convenience
export const {
  primary: { green, gold, red, black, white },
  gradients,
  buttons,
  semantic,
} = zimbabweColors;

// Default export for easy importing
export default zimbabweColors;