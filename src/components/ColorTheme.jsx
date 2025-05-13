import { useState, useEffect } from 'react';
import { useTheme } from '../context/theme/ThemeContext';
import IconLight from '../assets/images/icon-sun.svg?react';
import IconDark from '../assets/images/icon-moon.svg?react';
import IconSystem from '../assets/images/icon-system-theme.svg?react';
import { toastAction } from '../store';
import { useDispatch } from 'react-redux';

function ColorTheme() {
  const { theme, updateTheme } = useTheme();
  const [themeState, setThemeState] = useState({
    selected: theme,
    applied: theme,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setThemeState({ selected: theme, applied: theme });
  }, [theme]);

  const handleSelection = (newTheme) => {
    setThemeState((prev) => ({ ...prev, selected: newTheme }));
  };

  const applyChanges = () => {
    setThemeState((prev) => ({ ...prev, applied: prev.selected }));
    updateTheme(themeState.selected);
    dispatch(toastAction.showToast({ message: 'Settings updated successfully!', subText: '' }));
  };

  const isMobile = window.innerWidth < 1024;

  return (
    <div className={isMobile ? '' : 'pl-8 pt-10'}>
      {!isMobile && (
        <div className='mb-6'>
          <h1 className="capitalize text-2xl font-semibold text-gray-950 dark:text-gray-50">Color Theme</h1>
          <p className="text-lg text-gray-950 dark:text-gray-50">Choose your color theme:</p>
        </div>
      )}

      {isMobile && <p className="text-gray-700 dark:text-gray-300 mb-4">Choose your color theme:</p>}

      <div className="flex flex-col gap-4">
        <label
          className={`flex items-center justify-between gap-1 p-4 rounded-lg border-2 cursor-pointer 
            ${themeState.selected === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full dark:bg-gray-700">
              <IconLight />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Light Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pick a clean and classic light theme</p>
            </div>
          </div>
          <input
            type="radio"
            name="theme"
            checked={themeState.selected === 'light'}
            onChange={() => handleSelection('light')}
            className="h-5 w-5 accent-blue-500"
          />
        </label>

        <label 
          className={`flex items-center gap-1 justify-between p-4 rounded-lg border-2 cursor-pointer 
            ${themeState.selected === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full dark:bg-gray-700">
              <IconDark />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Select a sleek and modern dark theme</p>
            </div>
          </div>
          <input
            type="radio"
            name="theme"
            checked={themeState.selected === 'dark'}
            onChange={() => handleSelection('dark')}
            className="h-5 w-5 accent-blue-500"
          />
        </label>

        <label
          className={`flex items-center justify-between gap-2 p-4 rounded-lg border-2 cursor-pointer 
            ${themeState.selected === 'system' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full dark:bg-gray-700">
              <IconSystem />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">System</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Adapts to your device&apos;s theme</p>
            </div>
          </div>
          <input
            type="radio"
            name="theme"
            checked={themeState.selected === 'system'}
            onChange={() => handleSelection('system')}
            className="h-5 w-5 accent-blue-500"
          />
        </label>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={applyChanges}
          disabled={themeState.selected === themeState.applied}
          className={`px-4 py-2 rounded-lg text-white ${
            themeState.selected === themeState.applied ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
          }`}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}

export default ColorTheme;
