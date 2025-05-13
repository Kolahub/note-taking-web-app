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
  { name: 'font-mono', label: 'Monospace', description: 'Code-like, great for a technical vibe.', icon: <IconMono /> },
];

function FontTheme() {
  const { font, updateFont, isLoading } = useFont();
  // Initialize using the context font (which defaults to 'font-sans')
  const [fontState, setFontState] = useState({
    selected: font,
    applied: font,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      // If the fetched font is different, update the state
      setFontState({ selected: font, applied: font });
    }
  }, [font, isLoading]);

  const handleSelection = (newFont) => {
    setFontState((prev) => ({ ...prev, selected: newFont }));
  };

  const applyChanges = () => {
    setFontState((prev) => ({ ...prev, applied: prev.selected }));
    updateFont(fontState.selected);
    dispatch(toastAction.showToast({ message: 'Settings updated successfully!', subText: '' }));
  };

  if (isLoading) return <div>Loading font settings...</div>;

  const isMobile = window.innerWidth < 1024;

  return (
    <div className={isMobile ? '' : 'pl-8 pt-10'}>
      {!isMobile && (
        <div className='mb-6'>
          <h1 className="text-2xl font-semibold text-gray-950 dark:text-gray-50">Font Theme</h1>
          <p className="text-lg text-gray-950 dark:text-gray-50">Choose your preferred font:</p>
        </div>
      )}

      {isMobile && <p className="text-gray-700 dark:text-gray-300 mb-4">Choose your preferred font:</p>}

      <div className="flex flex-col gap-4">
        {fontOptions.map(({ name, label, description, icon }) => (
          <label
            key={name}
            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer 
              ${fontState.selected === name ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`${name} bg-gray-100 p-2 rounded-full dark:bg-gray-700`}>{icon}</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
              </div>
            </div>
            <input type="radio" name="font" checked={fontState.selected === name} onChange={() => handleSelection(name)} className="h-5 w-5 accent-blue-500" />
          </label>
        ))}

        <div className="flex justify-end mt-6">
          <button
            onClick={applyChanges}
            disabled={fontState.selected === fontState.applied}
            className={`px-4 py-2 rounded-lg text-white ${
              fontState.selected === fontState.applied ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
            }`}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default FontTheme;
