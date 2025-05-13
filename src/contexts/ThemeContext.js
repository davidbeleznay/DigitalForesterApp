// src/contexts/ThemeContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for theme
const ThemeContext = createContext();

// Create a hook to use the theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if user has previously set a theme preference
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  };

  const [theme, setTheme] = useState(getSavedTheme);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme to document body when theme changes
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
