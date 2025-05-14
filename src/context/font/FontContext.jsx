import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import supabase from '../../config/SupabaseConfig';

const FontContext = createContext();

export function FontProvider({ children }) {
  const [currentFont, setCurrentFont] = useState('font-sans');
  const [isLoading, setIsLoading] = useState(true);

  // Utility function to apply the font while preserving all other classes.
  const applyFont = (fontClass) => {
    // List of classes that are used for fonts
    const fontClasses = ['font-sans', 'font-serif', 'font-mono'];
    // Get the current classes on the <html> element.
    const currentClasses = document.documentElement.className.split(' ');
    // Filter out any classes that are in our fontClasses list.
    const preservedClasses = currentClasses.filter((cls) => !fontClasses.includes(cls));
    // Update the className with preserved classes plus the new font.
    document.documentElement.className = [...preservedClasses, fontClass].join(' ');
  };

  // Fetch the user's font preference from the database.
  useEffect(() => {
    const fetchFont = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('profiles').select('fontTheme').eq('id', user.id).single();

        if (!error && data.fontTheme) {
          setCurrentFont(data.fontTheme);
        }
      }
      setIsLoading(false);
    };

    fetchFont();
  }, []);

  // Function to update the font both in state and on the document element.
  const updateFont = async (newFont) => {
    setCurrentFont(newFont);
    applyFont(newFont);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ fontTheme: newFont }).eq('id', user.id);
    }
  };

  // Re-apply the font whenever currentFont changes.
  useEffect(() => {
    applyFont(currentFont);
  }, [currentFont]);

  return <FontContext.Provider value={{ font: currentFont, updateFont, isLoading }}>{children}</FontContext.Provider>;
}

FontProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useFont = () => useContext(FontContext);
