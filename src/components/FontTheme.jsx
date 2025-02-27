import { useState, useEffect } from 'react';
import { useFont } from '../context/font/fontContext';
import IconSans from '../assets/images/icon-font-sans-serif.svg?react';
import IconSerif from '../assets/images/icon-font-serif.svg?react';
import IconMono from '../assets/images/icon-font-monospace.svg?react';
import { toastAction } from '../store';
import { useDispatch } from 'react-redux';

const fontOptions = [
  { name: 'font-sans', label: 'Sans-serif', description: 'Clean and modern, easy to read.', icon: <IconSans /> },
  { name: 'font-serif', label: 'Serif', description: 'Classic and elegant for a timeless feel.', icon: <IconSerif /> },
  { name: 'font-mono', label: 'Monospace', description: 'Code-like, great for a technical vibe.', icon: <IconMono /> }
];

function FontTheme() {
  const { font, updateFont, isLoading } = useFont();
  // Initialize using the context font (which defaults to 'font-sans')
  const [fontState, setFontState] = useState({
    selected: font,
    applied: font
  });

  const dispatch = useDispatch()

  useEffect(() => {
    if (!isLoading) {
      // If the fetched font is different, update the state
      setFontState({ selected: font, applied: font });
    }
  }, [font, isLoading]);

  const handleSelection = (newFont) => {
    setFontState(prev => ({ ...prev, selected: newFont }));
  };

  const applyChanges = () => {
    setFontState(prev => ({ ...prev, applied: prev.selected }));
    updateFont(fontState.selected);
    dispatch(toastAction.showToast({ message: 'Settings updated successfully!', subText: '' }));
    
  };

  if (isLoading) return <div>Loading font settings...</div>;

  return (
    <div className="pl-8 pt-10">
      <h1 className="text-2xl font-semibold text-gray-950 dark:text-gray-50">
        Font Theme
      </h1>
      <p className="text-lg text-gray-950 dark:text-gray-50">
        Choose your preferred font:
      </p>

      <div className="mt-6">
        <form className="flex flex-col gap-4">
          {fontOptions.map(({ name, label, description, icon }) => (
            <label
              key={name}
              className={`flex items-center gap-4 cursor-pointer p-4 rounded-lg border dark:border-gray-700 transition-all duration-200 ${
                fontState.selected === name 
                  ? 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <input 
                type="radio" 
                name="font" 
                value={name} 
                className="hidden" 
                onChange={() => handleSelection(name)} 
                checked={fontState.selected === name} 
              />
              <div className={`${name} p-2 rounded-lg w-12 h-12 flex items-center justify-center text-black dark:text-gray-100 bg-white dark:bg-black border-2 dark:border-gray-800`}>
                {icon}
              </div>
              <div className="flex-1">
                <h1 className="font-semibold text-lg text-gray-950 dark:text-gray-50">
                  {label}
                </h1>
                <p className="text-gray-950 dark:text-gray-50">{description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  fontState.selected === name 
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
              className="bg-blue-500 text-white w-40 rounded-lg py-3 px-4 active:scale-95" 
              onClick={applyChanges}
              disabled={fontState.selected === fontState.applied}
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default FontTheme;