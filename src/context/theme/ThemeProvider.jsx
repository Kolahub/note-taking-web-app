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
    const applySystemTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(isDark ? 'dark' : 'light');
    };

    if (themeState.theme === 'system') {
      // Apply immediately
      applySystemTheme();
      
      // Set up listener for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applySystemTheme);
      
      // Also check for Samsung browser's dark mode
      const isSamsungDark = window.navigator.userAgent.match(/samsungbrowser/i) && 
                          window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (isSamsungDark) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }

      return () => mediaQuery.removeEventListener('change', applySystemTheme);
    }
  }, [themeState.theme]);

  useEffect(() => {
    const applyTheme = (theme) => {
      document.documentElement.classList.remove('light', 'dark', 'system');
      document.documentElement.classList.add(theme);
      
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.add(isDark ? 'dark' : 'light');
      }
    };

    const initializeTheme = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          // If not authenticated, default to system theme
          applyTheme('system');
          setThemeState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // First check if we have a theme preference in Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('theme')
          .eq('id', user.id)
          .single();

        let userTheme = 'system';
        
        if (error) {
          console.error('Error fetching theme, using system theme:', error);
        } else {
          userTheme = data?.theme || 'system';
        }
        
        // Apply the theme
        applyTheme(userTheme);

        setThemeState({
          theme: userTheme,
          isLoading: false
        });
      } catch (error) {
        console.error('Error in theme initialization:', error);
        // Fallback to system theme if any error occurs
        document.documentElement.classList.remove('light', 'dark', 'system');
        document.documentElement.classList.add('system');
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.add(isDark ? 'dark' : 'light');
        setThemeState(prev => ({ ...prev, isLoading: false }));
      }
    };

    // Initialize theme immediately
    initializeTheme();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        initializeTheme();
      } else if (event === 'SIGNED_OUT') {
        // When signed out, default to system theme
        applyTheme('system');
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

      // First check if profile exists
      const { error: getError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (getError) {
        // If profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, theme: newTheme }]);

        if (insertError) throw insertError;
      } else {
        // If profile exists, update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ theme: newTheme })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

      setThemeState(prev => ({ ...prev, theme: newTheme }));
    } catch (error) {
      console.error('Error updating theme:', error);
      // If update fails, revert the DOM changes
      document.documentElement.classList.remove(newTheme);
      document.documentElement.classList.add(themeState.theme);
      if (themeState.theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.add(isDark ? 'dark' : 'light');
      }
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