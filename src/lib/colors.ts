export const zimbabweColors = {
  primary: {
    green: "#22C55E",
    yellow: "#EAB308",
    red: "#DC2626",
  },

  gradients: {
    primary: "from-green-600 to-yellow-500",
    secondary: "from-red-600 to-yellow-500",
    success: "from-green-500 to-yellow-500",
    warning: "from-yellow-500 to-red-500",
    hero: "from-green-50 to-yellow-50",
    card: "from-red-50 to-yellow-50",
  },

  buttons: {
    primary:
      "bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600",
    secondary:
      "bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600",
    accent:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
    outline:
      "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
    ghost: "text-green-600 hover:bg-green-50",
    premium:
      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
  },

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
  },
};

export const {
  primary: { green, yellow, red },
  gradients,
  buttons,
  semantic,
} = zimbabweColors;

export default zimbabweColors;
