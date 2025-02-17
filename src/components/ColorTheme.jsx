import { useState, useEffect } from 'react';
import { useTheme } from '../context/theme/ThemeContext';
import IconLight from '../assets/images/icon-sun.svg?react';
import IconDark from '../assets/images/icon-moon.svg?react';
import IconSystem from '../assets/images/icon-system-theme.svg?react';

function ColorTheme() {
  const { theme, updateTheme } = useTheme();
  const [themeState, setThemeState] = useState({
    selected: theme,
    applied: theme
  });

  useEffect(() => {
    setThemeState({ selected: theme, applied: theme });
  }, [theme]);

  const handleSelection = (newTheme) => {
    setThemeState(prev => ({ ...prev, selected: newTheme }));
  };

  const applyChanges = () => {
    setThemeState(prev => ({ ...prev, applied: prev.selected }));
    updateTheme(themeState.selected);
  };

  return (
    <div className="pl-8 pt-10">
      <h1 className="capitalize text-2xl font-semibold text-gray-950 dark:text-gray-50">
        Color Theme
      </h1>
      <p className="text-lg text-gray-950 dark:text-gray-50">
        Choose your color theme:
      </p>

      <div className="mt-6">
        <form className="flex flex-col gap-4">
          {[
            { name: 'light', icon: <IconLight />, description: 'Pick a clean and classic light theme' },
            { name: 'dark', icon: <IconDark />, description: 'Select a sleek and modern dark theme' },
            { name: 'system', icon: <IconSystem />, description: 'Adapts to your device’s theme' },
          ].map(({ name, icon, description }) => (
            <label
              key={name}
              className={`flex items-center gap-4 cursor-pointer p-4 rounded-lg border dark:border-gray-700 transition ${
                themeState.selected === name 
                  ? 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <input 
                type="radio" 
                name="theme" 
                value={name} 
                className="hidden" 
                onChange={() => handleSelection(name)} 
                checked={themeState.selected === name} 
              />
              <div className="bg-white dark:bg-black border-2 dark:border-gray-800 dark:text-gray-100 p-2 rounded-lg w-12 h-12 flex items-center justify-center">
                {icon}
              </div>
              <div className="flex-1">
                <h1 className="capitalize font-semibold text-lg text-gray-950 dark:text-gray-50">
                  {name} mode
                </h1>
                <p className="text-gray-950 dark:text-gray-50">{description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  themeState.selected === name 
                    ? 'bg-blue-500 border-none' 
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="w-2 h-2 bg-white dark:bg-gray-800 rounded-full"></div>
              </div>
            </label>
          ))}

          <div className="flex justify-end font-medium">
            <button 
              type="button" 
              className="bg-blue-500 text-white capitalize w-36 rounded-lg py-3 px-4 active:scale-95" 
              onClick={applyChanges}
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ColorTheme;
