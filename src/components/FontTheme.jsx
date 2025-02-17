import React, { useState, useEffect } from 'react';
import supabase from '../config/SupabaseConfig';
import { useFont } from '../context/font/FontContext';
import { fontOptions } from '../context/font/fontsConstants';
// import { supabase } from '../supabaseClient';

function FontTheme() {
  const { font, updateFont } = useFont();
  const [fontState, setFontState] = useState({
    selected: font,
    applied: font
  });

  useEffect(() => {
    setFontState({ selected: font, applied: font });
  }, [font]);

  const handleSelection = (newFont) => {
    setFontState(prev => ({ ...prev, selected: newFont }));
  };

  const applyChanges = async () => {
    await updateFont(fontState.selected);
    setFontState(prev => ({ ...prev, applied: prev.selected }));
    const { error } = await supabase
      .from('profiles')
      .update({ FontTheme: fontState.selected })
      .eq('id', supabase.auth.user().id);

    if (error) {
      console.error('Error updating theme:', error);
    }
  };

  return (
    <div className="pl-8 pt-10">
      <h1 className="capitalize text-2xl font-semibold">Font Theme</h1>
      <p className="text-lg">Choose your font style:</p>
      <div className="mt-6">
        <form className="flex flex-col gap-4">
          {fontOptions.map(({ name, label, description }) => {
            const isSelected = fontState.selected === name;
            return (
              <label
                key={name}
                className={`flex items-center gap-4 cursor-pointer p-4 rounded-lg border transition ${
                  isSelected ? 'bg-gray-100 border-gray-300' : 'hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="font"
                  value={name}
                  className="hidden"
                  onChange={() => handleSelection(name)}
                  checked={isSelected}
                />
                <div className="bg-white border-2 p-2 rounded-lg w-12 h-12 flex items-center justify-center">
                  {name === 'font-sans' && <span className="font-sans text-xl">Aa</span>}
                  {name === 'font-serif' && <span className="font-serif text-xl">Aa</span>}
                  {name === 'font-mono' && <span className="font-mono text-xl">Aa</span>}
                </div>
                <div className="flex-1">
                  <h1 className="capitalize font-semibold text-lg">{label} style</h1>
                  <p>{description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'bg-blue-500 border-none' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </label>
            );
          })}
          {fontState.selected !== fontState.applied && (
            <div className="flex justify-end font-medium">
              <button
                type="button"
                className="bg-blue-500 text-white capitalize w-36 rounded-lg py-3 px-4 active:scale-95"
                onClick={applyChanges}
              >
                Apply Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default FontTheme;