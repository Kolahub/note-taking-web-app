import { useState, useEffect } from 'react';
import supabase from '../config/SupabaseConfig';
import IconLight from '../assets/images/icon-sun.svg?react';
import IconDark from '../assets/images/icon-moon.svg?react';
import IconSystem from '../assets/images/icon-system-theme.svg?react';

function ColorTheme() {
  const [themeState, setThemeState] = useState({
    selected: 'light', // User-selected theme
    applied: 'light', // Currently applied theme
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Error fetching user:', error);
      else setUser(data?.session?.user || null);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUserTheme = async () => {
      const { data, error } = await supabase.from('profiles').select('theme').eq('id', user.id).single();

      if (error) console.error('Error fetching theme:', error);
      else {
        setThemeState({ selected: data.theme, applied: data.theme });
        applyTheme(data.theme);
      }
    };

    fetchUserTheme();
  }, [user]);

  const applyTheme = (theme) => {
    document.documentElement.classList.remove('light', 'dark', 'system');
    document.documentElement.classList.add(theme);
  };

  const handleSelection = (theme) => {
    setThemeState((prev) => ({ ...prev, selected: theme }));
  };

  const applyChanges = async () => {
    setThemeState((prev) => ({ ...prev, applied: prev.selected }));
    applyTheme(themeState.selected);

    const { error } = await supabase.from('profiles').upsert({ id: user.id, theme: themeState.selected });

    if (error) console.error('Error updating theme:', error);

    // Store in localStorage
    localStorage.setItem('theme', themeState.selected);
  };

  return (
    <div className="pl-8 pt-10">
      <h1 className="capitalize text-2xl font-semibold">Color Theme</h1>
      <p className="text-lg">Choose your color theme:</p>

      <div className="mt-6">
        <form className="flex flex-col gap-4">
          {[
            { name: 'light', icon: <IconLight />, description: 'Pick a clean and classic light theme' },
            { name: 'dark', icon: <IconDark />, description: 'Select a sleek and modern dark theme' },
            { name: 'system', icon: <IconSystem />, description: 'Adapts to your device’s theme' },
          ].map(({ name, icon, description }) => (
            <label
              key={name}
              className={`flex items-center gap-4 cursor-pointer p-4 rounded-lg border transition ${
                themeState.selected === name ? 'bg-gray-100 border-gray-300' : 'hover:bg-gray-100'
              }`}
            >
              <input type="radio" name="theme" value={name} className="hidden" onChange={() => handleSelection(name)} checked={themeState.selected === name} />
              <div className="bg-white border-2 p-2 rounded-lg w-12 h-12 flex items-center justify-center">{icon}</div>
              <div className="flex-1">
                <h1 className="capitalize font-semibold text-lg">{name} mode</h1>
                <p>{description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  themeState.selected === name ? 'bg-blue-500 border-none' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </label>
          ))}

          <div className="flex justify-end font-medium">
            <button type="button" className="bg-blue-500 text-white capitalize w-36 rounded-lg py-3 px-4 active:scale-95" onClick={applyChanges}>
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ColorTheme;
