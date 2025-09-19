import React, { createContext, useContext } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children, theme }) => {
  const themeClasses = {
    isDark: theme === 'dark',
    isLight: theme === 'light',
    
    // Background colors
    bg: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: theme === 'dark' ? 'bg-gray-800/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm',
    modalBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    inputBg: theme === 'dark' ? 'bg-gray-700' : 'bg-white',
    gradientBg: theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100',
    
    // Text colors
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textLight: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    textSubtle: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    textOnBackground: theme === 'dark' ? 'text-gray-100' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-200' : 'text-gray-700',
    
    // Border colors
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    borderLight: theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
    
    // Hover states
    hover: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    hoverCard: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    
    // Focus states
    focus: 'focus:ring-2 focus:ring-blue-500',
    
    // Interactive elements
    button: theme === 'dark' 
      ? 'bg-gray-700 text-white hover:bg-gray-600' 
      : 'bg-white text-gray-900 hover:bg-gray-50',
    
    // Utility classes
    shadow: theme === 'dark' ? 'shadow-xl shadow-black/20' : 'shadow-xl',
    
    // CSS classes for HTML element
    htmlClass: theme === 'dark' ? 'dark' : 'light'
  };

  const value = {
    theme,
    ...themeClasses,
    // Helper functions
    getTextColor: (variant = 'default') => {
      switch (variant) {
        case 'muted': return themeClasses.textMuted;
        case 'light': return themeClasses.textLight;
        case 'subtle': return themeClasses.textSubtle;
        case 'onBackground': return themeClasses.textOnBackground;
        case 'secondary': return themeClasses.textSecondary;
        default: return themeClasses.text;
      }
    },
    getBgColor: (variant = 'default') => {
      switch (variant) {
        case 'card': return themeClasses.cardBg;
        case 'input': return themeClasses.inputBg;
        case 'modal': return themeClasses.modalBg;
        default: return themeClasses.bg;
      }
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};