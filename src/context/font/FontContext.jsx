// FontContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../../config/SupabaseConfig';
// import { supabase } from '../supabaseClient';

const FontContext = createContext();

export function FontProvider({ children }) {
  // Default font is "font-sans"
  const [font, setFont] = useState('font-sans');

  useEffect(() => {
    async function fetchFont() {
      const user = supabase.auth.user();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('font')
          .eq('id', user.id)
          .single();
        if (!error && data && data.font) {
          setFont(data.font);
        }
      }
    }
    fetchFont();
  }, []);

  const updateFont = async (newFont) => {
    setFont(newFont);
    const user = supabase.auth.user();
    if (user) {
      await supabase
        .from('profiles')
        .update({ font: newFont })
        .eq('id', user.id);
    }
  };

  return (
    <FontContext.Provider value={{ font, updateFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  return useContext(FontContext);
}
