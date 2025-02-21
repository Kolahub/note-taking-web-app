import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import IconSearch from '../assets/images/icon-search.svg?react';
import IconSettings from '../assets/images/icon-settings.svg?react';
import { noteAction } from '../store';
import { useTheme } from '../context/theme/ThemeContext';

function SubNav() {
  const dispatch = useDispatch();
  const filteredTag = useSelector((state) => state.filteredTag);
  const searchQuery = useSelector((state) => state.searchQuery);
  const settingsActive = useSelector((state) => state.settingsActive);
  const [searchText, setSearchText] = useState('');
  const { isLoading: themeLoading } = useTheme();

  // Determine the heading based on filters or search query
  const otherDisplayHeading = filteredTag || searchQuery || settingsActive;

  // Dispatch search query action
  const handleSearchQueryNotes = function (e) {
    const query = e.target.value;
    dispatch(noteAction.allSearchQueryNotes(query));
    setSearchText(query);
  };

  useEffect(() => {
    if (settingsActive) {
      setSearchText('');
    }
  }, [settingsActive]);

  const toggleOpenSettings = function () {
    dispatch(noteAction.toggleOpenSettings());
    dispatch(noteAction.clearFilters());
    if (settingsActive) {
    dispatch(noteAction.applyActiveSettings('color theme'));
    }
  };

  if (themeLoading) {
    return (
      <div className="w-full flex gap-4 items-center justify-between px-8 py-[18.5px] animate-pulse">
        {/* Header skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>

        {/* Search and settings skeleton */}
        <div className="flex gap-8">
          <div className="flex items-center gap-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-[400px] h-12"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-4 items-center justify-between px-8 py-[18.5px]">
      <div>
        <h1 className="capitalize text-3xl font-bold text-gray-900 dark:text-gray-100">
          {!otherDisplayHeading ? (
            'All Notes'
          ) : (
            <div className="flex flex-wrap items-center gap-1">
              <div className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {filteredTag ? (
                  'note tagged: '
                ) : searchQuery ? (
                  'showing results for: '
                ) : settingsActive ? (
                  <span className="text-gray-800 dark:text-gray-200">settings</span>
                ) : null}
              </div>
              <div className="max-w-xs overflow-x-auto scrollbar-hide whitespace-nowrap text-gray-900 dark:text-gray-100">
                {otherDisplayHeading}
              </div>
            </div>
          )}
        </h1>
      </div>

      <div className="flex gap-8">
        <div className="flex items-center gap-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 px-4 py-3">
          <div className="text-black dark:text-gray-400">
            <IconSearch />
          </div>
          <input
            type="text"
            className="focus:outline-none w-[320px] text-black dark:text-white bg-transparent placeholder-gray-800 dark:placeholder-gray-400"
            value={searchText}
            placeholder='Search by title, content, or tags…'
            onChange={(e) => handleSearchQueryNotes(e)}
          />
        </div>
        <button type="button" className="active:scale-110 transition-all" onClick={toggleOpenSettings}>
          <div className="text-gray-500 dark:text-gray-400">
            <IconSettings />
          </div>
        </button>
      </div>
    </div>
  );
}

export default SubNav;
