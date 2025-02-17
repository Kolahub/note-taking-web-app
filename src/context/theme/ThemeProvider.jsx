// src/context/theme/ThemeProvider.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import supabase from '../../config/SupabaseConfig';
import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }) {
  const [themeState, setThemeState] = useState({
    theme: 'system',
    isLoading: true
  });

  // Handle system theme changes
  useEffect(() => {
    if (themeState.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(e.matches ? 'dark' : 'light');
      };

      // Set initial system theme
      handleChange(mediaQuery);
      
      // Listen for system theme changes
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeState.theme]);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setThemeState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('theme')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const userTheme = data?.theme || 'system';
        
        // Remove all theme classes first
        document.documentElement.classList.remove('light', 'dark', 'system');
        
        // Add the user's theme preference
        document.documentElement.classList.add(userTheme);
        
        // If system theme, apply the actual light/dark class
        if (userTheme === 'system') {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.add(isDark ? 'dark' : 'light');
        }

        setThemeState({
          theme: userTheme,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching theme:', error);
        setThemeState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeTheme();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        initializeTheme();
      } else if (event === 'SIGNED_OUT') {
        document.documentElement.classList.remove('light', 'dark', 'system');
        document.documentElement.classList.add('system');
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.add(isDark ? 'dark' : 'light');
        setThemeState({ theme: 'system', isLoading: false });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const updateTheme = async (newTheme) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Remove all theme classes first
      document.documentElement.classList.remove('light', 'dark', 'system');
      
      // Add the new theme
      document.documentElement.classList.add(newTheme);

      // If system theme, apply the actual light/dark class
      if (newTheme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.add(isDark ? 'dark' : 'light');
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, theme: newTheme });

      if (error) throw error;

      setThemeState(prev => ({ ...prev, theme: newTheme }));
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ ...themeState, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};