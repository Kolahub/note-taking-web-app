import { useState } from 'react';
import IconLight from '../assets/images/icon-sun.svg?react';
import IconDark from '../assets/images/icon-moon.svg?react';
import IconSystem from '../assets/images/icon-system-theme.svg?react';

function ColorTheme() {
  const [selectedTheme, setSelectedTheme] = useState('light');

  return (
    <div className="pl-8 pt-10">
      <h1 className="capitalize text-2xl font-semibold">color theme</h1>
      <p className="text-lg">Choose your color theme:</p>

      <div className="mt-6">
        <form className="flex flex-col gap-4">
          {/* Light Mode */}
          <label
            className={`flex items-center gap-4 cursor-pointer p-4 rounded-lg border transition ${
              selectedTheme === 'light' ? 'bg-gray-100 border-gray-300' : 'hover:bg-gray-100'
            }`}
          >
            <input type="radio" name="theme" value="light" className="hidden" onChange={() => setSelectedTheme('light')} checked={selectedTheme === 'light'} />
            <div className="bg-white border-2 p-2 rounded-lg w-12 h-12 flex items-center justify-center">
              <IconLight />
            </div>
            <div className="flex-1">
              <h1 className="capitalize font-semibold text-lg">light mode</h1>
              <p>Pick a clean and classic light theme</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedTheme === 'light' ? 'bg-blue-500 border-none' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </label>

          {/* Dark Mode */}
          <label
            className={`flex items-center gap-4 cursor-pointer p-4 rounded-lg border transition ${
              selectedTheme === 'dark' ? 'bg-gray-100 border-gray-300' : 'hover:bg-gray-100'
            }`}
          >
            <input type="radio" name="theme" value="dark" className="hidden" onChange={() => setSelectedTheme('dark')} checked={selectedTheme === 'dark'} />
            <div className="bg-white border-2 p-2 rounded-lg w-12 h-12 flex items-center justify-center">
              <IconDark />
            </div>
            <div className="flex-1">
              <h1 className="capitalize font-semibold text-lg">dark mode</h1>
              <p>Select a sleek and modern dark theme</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedTheme === 'dark' ? 'bg-blue-500 border-none' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </label>

          {/* System Mode */}
          <label
            className={`flex items-center gap-4 cursor-pointer p-4 rounded-lg border transition ${
              selectedTheme === 'system' ? 'bg-gray-100 border-gray-300' : 'hover:bg-gray-100'
            }`}
          >
            <input
              type="radio"
              name="theme"
              value="system"
              className="hidden"
              onChange={() => setSelectedTheme('system')}
              checked={selectedTheme === 'system'}
            />
            <div className="bg-white border-2 p-2 rounded-lg w-12 h-12 flex items-center justify-center">
              <IconSystem />
            </div>
            <div className="flex-1">
              <h1 className="capitalize font-semibold text-lg">system</h1>
              <p>Adapts to your device’s theme</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedTheme === 'system' ? 'bg-blue-500 border-none' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </label>
          <div className="flex justify-end font-medium">
          <button className="bg-blue-500 text-white capitalize w-36 rounded-lg py-3 px-4">apply changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ColorTheme;
